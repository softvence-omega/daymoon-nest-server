import { IsNotEmpty, IsMongoId } from 'class-validator';

export class CreateSubCategoryDto {
  @IsNotEmpty()
  name: string;

  @IsMongoId()
  categoryId: string;
}
