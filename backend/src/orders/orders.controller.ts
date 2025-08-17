import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthAccessGuard } from '../auth/guards/auth-access.guard';
import { AdminRoleGuard } from '../auth/guards/admin-role.guard';
import { type JwtUser, User } from '../auth/decorators/user.decorator';

@UseGuards(AuthAccessGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @User() user: JwtUser) {
    return this.ordersService.create(createOrderDto, user);
  }

  @UseGuards(AdminRoleGuard)
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get('me')
  findMyOrders(@User() user: JwtUser) {
    return this.ordersService.findMyOrders(user);
  }

  @UseGuards(AdminRoleGuard)
  @Patch(':id/status')
  updateOrderStatus(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.updateOrderStatus(id, updateOrderDto);
  }
}
