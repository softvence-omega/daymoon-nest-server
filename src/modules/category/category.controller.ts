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
  UploadedFile,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from '../user/schemas/user.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/utils/cloudinary/cloudinary.service';

@Controller('category')
export class CategoryController {
  constructor(
    private categoryService: CategoryService,
    private cloudinaryService: CloudinaryService,
  ) {}

  @Post('create-category')
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body('data') data: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const dto: CreateCategoryDto = JSON.parse(data) as CreateCategoryDto;

    if (file) {
      const result = await this.cloudinaryService.uploadImage(file);
      dto.image = result.secure_url;
    }

    return this.categoryService.create(dto);
  }

  @Get('all-categories')
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Seller)
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body('data') data: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const dto: UpdateCategoryDto = JSON.parse(data) as UpdateCategoryDto;

    if (file) {
      const result = await this.cloudinaryService.uploadImage(file);
      dto.image = result.secure_url;
    }

    return this.categoryService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Seller)
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
