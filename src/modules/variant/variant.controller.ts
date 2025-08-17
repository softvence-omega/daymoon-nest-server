import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { VariantService } from './variant.service';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';

@Controller('variant')
export class VariantController {
  constructor(private variantService: VariantService) {}

  @Post('create-variant')
  create(@Body() dto: CreateVariantDto) {
    return this.variantService.create(dto);
  }

  @Get('product/:productId')
  findByProduct(@Param('productId') productId: string) {
    return this.variantService.findByProduct(productId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateVariantDto) {
    return this.variantService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.variantService.remove(id);
  }
}
