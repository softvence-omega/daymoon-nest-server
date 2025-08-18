import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { SubCategoryService } from './sub-category.service';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from '../user/schemas/user.schema';

@Controller('sub-category')
export class SubCategoryController {
  constructor(private subCategoryService: SubCategoryService) {}

  @Post('create-sub-category')
  create(@Body() dto: CreateSubCategoryDto) {
    return this.subCategoryService.create(dto);
  }

  @Get('all-sub-categories')
  findAll() {
    return this.subCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subCategoryService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Seller)
  update(@Param('id') id: string, @Body() dto: Partial<CreateSubCategoryDto>) {
    return this.subCategoryService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Seller)
  remove(@Param('id') id: string) {
    return this.subCategoryService.remove(id);
  }
}
