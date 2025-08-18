import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateVariantDto } from './dto/create-variant.dto';
import { Variant } from './schema/variant.schema';
import { Product } from '../product/schema/product.schema';

@Injectable()
export class VariantService {
  constructor(
    @InjectModel(Variant.name) private variantModel: Model<Variant>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async create(dto: CreateVariantDto) {
    // 1. Create the variant
    const variant = new this.variantModel(dto);
    const savedVariant = await variant.save();

    // 2. Push the variant ID to the Product's variantIds array
    await this.productModel.findByIdAndUpdate(
      dto.productId,
      { $push: { variantIds: savedVariant._id } },
      { new: true },
    );

    return savedVariant;
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
