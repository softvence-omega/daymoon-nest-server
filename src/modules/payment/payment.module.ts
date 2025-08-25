import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Payment, PaymentSchema } from './schema/payment.schema';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
    OrderModule,
  ],
  providers: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
