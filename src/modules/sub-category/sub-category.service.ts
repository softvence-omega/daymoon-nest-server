import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { SubCategory } from './schema/sub-category.schema';

@Injectable()
export class SubCategoryService {
  constructor(@InjectModel(SubCategory.name) private subCategoryModel: Model<SubCategory>) {}

  async create(dto: CreateSubCategoryDto) {
    const subCategory = new this.subCategoryModel(dto);
    return subCategory.save();
  }

  async findAll() {
    return this.subCategoryModel.find().populate('categoryId').exec();
  }

  async findOne(id: string) {
    const subCategory = await this.subCategoryModel.findById(id).populate('categoryId').exec();
    if (!subCategory) throw new NotFoundException('SubCategory not found');
    return subCategory;
  }

  async update(id: string, dto: Partial<CreateSubCategoryDto>) {
    return this.subCategoryModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async remove(id: string) {
    return this.subCategoryModel.findByIdAndDelete(id);
  }
}
