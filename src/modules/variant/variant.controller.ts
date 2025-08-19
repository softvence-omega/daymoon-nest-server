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
import { VariantService } from './variant.service';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from '../user/schemas/user.schema';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/utils/cloudinary/cloudinary.service';

@Controller('variant')
export class VariantController {
  constructor(
    private variantService: VariantService,
    private cloudinaryService: CloudinaryService,
  ) {}

  @Post('create-variant')
  @UseInterceptors(AnyFilesInterceptor())
  async create(
    @Body('data') data: string,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    const dto: CreateVariantDto = JSON.parse(data) as CreateVariantDto;

    if (files && files.length > 0) {
      const uploadedImages: string[] = [];
      for (const file of files) {
        const result = await this.cloudinaryService.uploadImage(file);
        uploadedImages.push(result.secure_url);
      }
      dto.images = uploadedImages;
    }

    return this.variantService.create(dto);
  }

  @Get('product/:productId')
  findByProduct(@Param('productId') productId: string) {
    return this.variantService.findByProduct(productId);
  }

  @Patch(':id')
  @UseInterceptors(AnyFilesInterceptor())
  async update(
    @Param('id') id: string,
    @Body('data') data: string,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    const dto: UpdateVariantDto = JSON.parse(data) as UpdateVariantDto;

    if (files && files.length > 0) {
      const uploadedImages: string[] = [];
      for (const file of files) {
        const result = await this.cloudinaryService.uploadImage(file);
        uploadedImages.push(result.secure_url);
      }
      dto.images = uploadedImages;
    }

    return this.variantService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Seller)
  remove(@Param('id') id: string) {
    return this.variantService.remove(id);
  }
}
