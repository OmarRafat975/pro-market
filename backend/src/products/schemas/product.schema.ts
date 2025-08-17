import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Product extends Document {
  @Prop({ required: true, unique: true })
  name: string;
  @Prop({ default: '' })
  description: string;
  @Prop({ required: true })
  price: number;
  @Prop({ required: true })
  category: string;
  @Prop({ default: '' })
  image: string;
  @Prop({ required: true })
  stock: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
