import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateVariantDto } from './dto/create-variant.dto';
import { Variant } from './schema/variant.schema';

@Injectable()
export class VariantService {
  constructor(@InjectModel(Variant.name) private variantModel: Model<Variant>) {}

  async create(dto: CreateVariantDto) {
    const variant = new this.variantModel(dto);
    return variant.save();
  }

  async findByProduct(productId: string) {
    return this.variantModel.find({ productId }).exec();
  }

  async update(id: string, dto: Partial<CreateVariantDto>) {
    return this.variantModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async remove(id: string) {
    return this.variantModel.findByIdAndDelete(id);
  }
}
