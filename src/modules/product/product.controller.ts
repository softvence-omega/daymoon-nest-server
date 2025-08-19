import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from '../user/schemas/user.schema';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/utils/cloudinary/cloudinary.service';

@Controller('product')
export class ProductController {
  constructor(
    private productService: ProductService,
    private cloudinaryService: CloudinaryService,
  ) {}

  @Post('create-product')
  @UseInterceptors(AnyFilesInterceptor())
  async create(
    @Body('data') data: string,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    const dto: CreateProductDto = JSON.parse(data) as CreateProductDto;

    if (files && files.length > 0) {
      const uploadedImages: string[] = [];
      for (const file of files) {
        const result = await this.cloudinaryService.uploadImage(file);
        uploadedImages.push(result.secure_url);
      }
      dto.images = uploadedImages;
    }

    return this.productService.create(dto);
  }

  @Get('all-products')
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(AnyFilesInterceptor())
  async update(
    @Param('id') id: string,
    @Body('data') data: string,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    const dto: UpdateProductDto = JSON.parse(data) as UpdateProductDto;

    if (files && files.length > 0) {
      const uploadedImages: string[] = [];
      for (const file of files) {
        const result = await this.cloudinaryService.uploadImage(file);
        uploadedImages.push(result.secure_url);
      }
      dto.images = uploadedImages;
    }

    return this.productService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Seller)
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
