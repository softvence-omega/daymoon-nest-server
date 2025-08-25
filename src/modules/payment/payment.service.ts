import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from './schema/payment.schema';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentService {
  constructor(@InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>) {}

  async create(dto: CreatePaymentDto): Promise<Payment> {
    const payment = new this.paymentModel(dto);
    const savedPayment = await payment.save();
    return savedPayment;
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentModel.find().populate('orderId').exec();
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentModel.findById(id).populate('orderId');
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }
}
