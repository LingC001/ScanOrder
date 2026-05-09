import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop()
  location: string;

  @Prop()
  tableNumber: string;

  @Prop()
  comment: string;

  @Prop()
  cartData: [];

  @Prop()
  totalFoodsPrice: number;

  @Prop()
  allFoodsNumber: number;

  @Prop()
  finished: boolean;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
