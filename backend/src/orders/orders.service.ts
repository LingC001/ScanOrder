import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private foodModel: Model<OrderDocument>,
  ) {}
  async create(createOrderDto: CreateOrderDto) {
    createOrderDto.finished = true;
    await this.foodModel.create(createOrderDto);
  }

  findAll() {
    return this.foodModel.find({});
  }

  findOne(id: string) {
    return this.foodModel.findById(id);
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
