import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShipmentService } from './shipment.service';
import { ShipmentController } from './shipment.controller';
import { Shipment, ShipmentSchema } from './schema/shipment.schema';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Shipment.name, schema: ShipmentSchema }]),
    OrderModule,
  ],
  providers: [ShipmentService],
  controllers: [ShipmentController],
})
export class ShipmentModule {}
