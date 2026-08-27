import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import type { Order, OrderItem, OrderStatus } from '@prisma/client';
import { resolveTranslation } from '../common/locale.util';

export interface FormattedOrderItem {
  id: string;
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  notes: string | null;
}

export interface FormattedOrder {
  id: string;
  status: OrderStatus;
  totalAmount: number;
  notes: string | null;
  tableId: string | null;
  tableName: string | null;
  createdAt: Date;
  updatedAt: Date;
  items: FormattedOrderItem[];
}

type OrderWithItems = Order & { items: OrderItem[] };

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  private formatOrder(order: OrderWithItems, tableNamesById: Map<string, string>): FormattedOrder {
    return {
      id: order.id,
      status: order.status,
      totalAmount: Number(order.totalAmount) || 0,
      notes: order.notes,
      tableId: order.tableId,
      tableName: order.tableId ? tableNamesById.get(order.tableId) ?? null : null,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items: order.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: resolveTranslation(item.productName),
        productPrice: Number(item.productPrice) || 0,
        quantity: item.quantity,
        notes: item.notes,
      })),
    };
  }

  private async tableNameMap(restaurantId: string, tableIds: string[]): Promise<Map<string, string>> {
    const uniqueIds = [...new Set(tableIds.filter((id): id is string => !!id))];
    if (uniqueIds.length === 0) return new Map();
    const tables = await this.prisma.table.findMany({
      where: { id: { in: uniqueIds }, restaurantId },
      select: { id: true, name: true },
    });
    return new Map(tables.map((t) => [t.id, t.name]));
  }

  /**
   * Public: a customer places an order for a restaurant, optionally scoped
   * to a table (the tableId that comes from their /t/:tableId link).
   * Prices are never trusted from the client - always re-priced server-side
   * from the live Product records, snapshotted onto the OrderItem.
   */
  async createOrder(slug: string, dto: CreateOrderDto): Promise<FormattedOrder> {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { slug },
      include: { settings: true },
    });

    if (!restaurant || !restaurant.isActive) {
      throw new NotFoundException(`Restaurant with slug "${slug}" not found`);
    }

    const orderingEnabled = restaurant.settings?.enableOrdering ?? true;
    if (!orderingEnabled) {
      throw new ForbiddenException('Ordering is not enabled for this restaurant');
    }

    const productIds = dto.items.map((i) => i.productId);
    const products = await this.prisma.product.findMany({
      where: {
        id: { in: productIds },
        isAvailable: true,
        category: { restaurantId: restaurant.id },
      },
    });

    const productsById = new Map(products.map((p) => [p.id, p]));

    const missing = productIds.filter((id) => !productsById.has(id));
    if (missing.length > 0) {
      throw new BadRequestException(
        `One or more products are unavailable or do not belong to this restaurant: ${missing.join(', ')}`,
      );
    }

    // Orders are only ever placed from a table-scoped link
    // (/[slug]/t/[tableId]) - the general/no-table menu link is browse-only,
    // by design, so staff always know which physical table an order came
    // from. Reject anything without a table that resolves to this
    // restaurant, rather than silently accepting an unattributed order.
    if (!dto.tableId) {
      throw new BadRequestException('Orders can only be placed from a table link');
    }
    const table = await this.prisma.table.findFirst({
      where: { id: dto.tableId, restaurantId: restaurant.id, isActive: true },
    });
    if (!table) {
      throw new BadRequestException('Invalid or inactive table');
    }
    const tableId = table.id;

    let totalAmount = 0;
    const itemsData = dto.items.map((item) => {
      const product = productsById.get(item.productId)!;
      const price = Number(product.price) || 0;
      totalAmount += price * item.quantity;
      return {
        productId: product.id,
        productName: product.name as object,
        productPrice: product.price,
        quantity: item.quantity,
        notes: item.notes,
      };
    });

    const order = await this.prisma.order.create({
      data: {
        restaurantId: restaurant.id,
        tableId,
        notes: dto.notes,
        totalAmount,
        status: 'PENDING',
        items: { create: itemsData },
      },
      include: { items: true },
    });

    const tableNames = tableId ? await this.tableNameMap(restaurant.id, [tableId]) : new Map<string, string>();
    return this.formatOrder(order, tableNames);
  }

  /** Admin: list orders for the authenticated tenant, newest first. */
  async findAllForRestaurant(restaurantId: string, status?: OrderStatus): Promise<FormattedOrder[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        restaurantId,
        ...(status ? { status } : {}),
      },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });

    const tableNames = await this.tableNameMap(
      restaurantId,
      orders.map((o) => o.tableId).filter((id): id is string => !!id),
    );

    return orders.map((order) => this.formatOrder(order, tableNames));
  }

  /** Admin: advance/cancel an order's status. */
  async updateStatus(id: string, restaurantId: string, status: OrderStatus): Promise<FormattedOrder> {
    const existing = await this.prisma.order.findFirst({ where: { id, restaurantId } });
    if (!existing) {
      throw new NotFoundException('Order not found');
    }

    const order = await this.prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true },
    });

    const tableNames = order.tableId
      ? await this.tableNameMap(restaurantId, [order.tableId])
      : new Map<string, string>();
    return this.formatOrder(order, tableNames);
  }
}
