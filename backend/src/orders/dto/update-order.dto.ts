import { IsEnum, IsString } from 'class-validator';
import { OrderStatus } from '../schemas/order.schema';

export class UpdateOrderDto {
  @IsString()
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
