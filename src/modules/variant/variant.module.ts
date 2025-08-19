import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VariantService } from './variant.service';
import { VariantController } from './variant.controller';
import { Variant, VariantSchema } from './schema/variant.schema';
import { Product, ProductSchema } from '../product/schema/product.schema';
import { CloudinaryModule } from 'src/utils/cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Variant.name, schema: VariantSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
    CloudinaryModule,
  ],
  controllers: [VariantController],
  providers: [VariantService],
  exports: [VariantService],
})
export class VariantModule {}
