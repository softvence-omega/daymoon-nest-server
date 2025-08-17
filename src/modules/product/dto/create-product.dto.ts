import { IsNotEmpty, IsMongoId, IsOptional, IsArray } from 'class-validator';

export class CreateProductDto {
  @IsMongoId()
  categoryId: string;

  @IsMongoId()
  subCategoryId: string;

  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsArray()
  images?: string[];
}
