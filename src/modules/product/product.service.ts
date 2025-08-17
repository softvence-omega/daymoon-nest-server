import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './schema/product.schema';

@Injectable()
export class ProductService {
  constructor(@InjectModel(Product.name) private productModel: Model<Product>) {}

  async create(dto: CreateProductDto) {
    const product = new this.productModel(dto);
    return product.save();
  }

  async findAll() {
    return this.productModel.find().populate('categoryId').populate('subCategoryId').exec();
  }

  async findOne(id: string) {
    const product = await this.productModel.findById(id).populate('categoryId').populate('subCategoryId').exec();
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string, dto: Partial<CreateProductDto>) {
    return this.productModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async remove(id: string) {
    return this.productModel.findByIdAndDelete(id);
  }
}
