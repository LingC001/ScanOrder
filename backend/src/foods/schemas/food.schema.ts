import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FoodDocument = Food & Document;

@Schema()
export class Food extends Document {
  @Prop()
  category: string;

  @Prop()
  name: string;

  @Prop()
  price: number;

  @Prop()
  description: string;

  @Prop()
  image: string;

  @Prop()
  recommended: boolean;
}

export const FoodSchema = SchemaFactory.createForClass(Food);
