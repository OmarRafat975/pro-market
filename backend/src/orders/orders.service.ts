import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import { Model, Types } from 'mongoose';
import { JwtUser } from '../auth/decorators/user.decorator';
import { Product } from '../products/schemas/product.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: JwtUser) {
    const normalized: Array<{
      productId: Types.ObjectId;
      quantity: number; // -1 if unavailable
      priceSnapshot?: number;
    }> = [];

    let total = 0;

    for (const line of createOrderDto.items) {
      const productId = new Types.ObjectId(line.productId);
      const qty = Number(line.quantity) || 0;

      if (qty <= 0) {
        normalized.push({ productId, quantity: -1 });
        continue;
      }

      // Atomic: only decrement if stock >= qty
      const doc = await this.productModel.findOneAndUpdate(
        { _id: productId, stock: { $gte: qty } },
        { $inc: { stock: -qty } },
        { new: false, projection: { price: 1 } }, // get old price to snapshot
      );

      if (doc) {
        normalized.push({ productId, quantity: qty, priceSnapshot: doc.price });
        total += doc.price * qty;
      } else {
        // product missing or not enough stock
        normalized.push({ productId, quantity: -1 });
      }
    }

    // Create the order (pending), total excludes unavailable lines
    return this.orderModel.create({
      userId: user.userId,
      items: normalized,
      total,
      status: 'pending',
    });
  }

  async findAll() {
    try {
      const res = await this.orderModel
        .find()
        .populate('userId', 'email')
        .populate('items.productId', 'name price image')
        .lean();
      const data = res.map((order) => ({
        ...order,
        items: order.items.filter((item) => item.productId !== null),
      }));
      return data;
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Faild to fetch all orders',
      );
    }
  }

  async findMyOrders(user: JwtUser) {
    try {
      const { userId } = user;

      const res = await this.orderModel
        .find({ userId })
        .populate('items.productId', 'name price image')
        .lean();

      const data = res.map((order) => ({
        ...order,
        items: order.items.filter((item) => item.productId !== null),
      }));
      return data;
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Faild to fetch user orders',
      );
    }
  }

  async updateOrderStatus(id: string, updateOrderDto: UpdateOrderDto) {
    try {
      return await this.orderModel.findByIdAndUpdate(
        id,
        {
          status: updateOrderDto.status,
        },
        { new: true },
      );
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Faild to update order status',
      );
    }
  }
}
