import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Shipment, ShipmentDocument } from './schema/shipment.schema';
import { CreateShipmentDto } from './dto/create-shipment.dto';

@Injectable()
export class ShipmentService {
  constructor(@InjectModel(Shipment.name) private shipmentModel: Model<ShipmentDocument>) {}

  async create(dto: CreateShipmentDto): Promise<Shipment> {
    const shipment = new this.shipmentModel(dto);
    return shipment.save();
  }

  async findAll(): Promise<Shipment[]> {
    return this.shipmentModel.find().populate('orderId').exec();
  }

  async findOne(id: string): Promise<Shipment> {
    const shipment = await this.shipmentModel.findById(id).populate('orderId');
    if (!shipment) throw new NotFoundException('Shipment not found');
    return shipment;
  }
}
