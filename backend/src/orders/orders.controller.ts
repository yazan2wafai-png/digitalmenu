import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StaffRoleGuard } from '../common/guards/staff-role.guard';
import { RequireStaffRole } from '../common/decorators/require-staff-role.decorator';
import { StaffRole } from '../common/staff-role.enum';
import { OrdersService } from './orders.service';
import type { FormattedOrder } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import type { AuthenticatedRequest } from '../auth/strategies/jwt.strategy';
import type { OrderStatus } from '@prisma/client';

/**
 * Public: a customer places an order from the live menu (optionally scoped
 * to a table via their /t/:tableId link). No auth - matches the public
 * GET /restaurants/:slug pattern.
 */
@Controller('restaurants/:slug/orders')
export class PublicOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(
    @Param('slug') slug: string,
    @Body() dto: CreateOrderDto,
  ): Promise<FormattedOrder> {
    return this.ordersService.createOrder(slug, dto);
  }
}

/**
 * Admin: tenant staff view/manage incoming orders. JWT-scoped by
 * req.user.restaurantId, same pattern as products/categories.
 */
@UseGuards(JwtAuthGuard)
@Controller('admin/orders')
export class AdminOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll(
    @Req() req: AuthenticatedRequest,
    @Query('status') status?: OrderStatus,
  ): Promise<FormattedOrder[]> {
    return this.ordersService.findAllForRestaurant(req.user.restaurantId ?? '', status);
  }

  @Patch(':id/status')
  @UseGuards(StaffRoleGuard)
  @RequireStaffRole(StaffRole.OWNER, StaffRole.EDITOR)
  updateStatus(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateOrderStatusDto,
  ): Promise<FormattedOrder> {
    return this.ordersService.updateStatus(id, req.user.restaurantId ?? '', dto.status);
  }
}
