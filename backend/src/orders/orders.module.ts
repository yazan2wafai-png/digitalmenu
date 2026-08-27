import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { PublicOrdersController, AdminOrdersController } from './orders.controller';

@Module({
  controllers: [PublicOrdersController, AdminOrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
