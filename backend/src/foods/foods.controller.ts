import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FoodsService } from './foods.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { Request } from 'express';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { replaceFileName } from '../utils/util';

@Controller('foods')
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('pic'))
  create(
    @Req() request: Request,
    @UploadedFile() file: Express.Multer.File,
    @Body() createFoodDto: CreateFoodDto,
  ) {
    const { NODE_ENV } = process.env;
    const hostName =
      NODE_ENV === 'development' ? 'localhost:3000' : 'ybdev.top';
    const resName = replaceFileName(file.originalname);
    createFoodDto.image = `http://${hostName}/images/${resName}`;
    const writeImage = createWriteStream(
      join(__dirname, '..', '../public/upload', `${resName}`),
    );
    writeImage.write(file.buffer);
    return this.foodsService.create(createFoodDto);
  }

  @Get()
  findAll() {
    return this.foodsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.foodsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFoodDto: UpdateFoodDto) {
    return this.foodsService.update(+id, updateFoodDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.foodsService.remove(+id);
  }
}
