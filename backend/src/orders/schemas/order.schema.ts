import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum OrderStatus {
  Pending = 'pending',
  shipped = 'shipped',
  Delivered = 'delivered',
}
// Items Schema
@Schema({ _id: false, versionKey: false })
export class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ type: Number, required: true, min: -1 })
  quantity: number;

  // price at time of ordering
  @Prop({ type: Number, required: true, min: 0 })
  priceSnapshot: number;
}
export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

// Order Scheam
@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({
    type: [OrderItemSchema],
    required: true,
    validate: {
      validator: (items: OrderItem[]) =>
        Array.isArray(items) && items.length > 0,
      message: 'Order must have at least one item',
    },
  })
  items: OrderItem[];

  @Prop({ type: Number, required: true, min: 0 })
  total: number;

  @Prop({
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.Pending,
  })
  status: OrderStatus;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
