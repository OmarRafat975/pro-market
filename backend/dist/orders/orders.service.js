"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const order_schema_1 = require("./schemas/order.schema");
const mongoose_2 = require("mongoose");
const product_schema_1 = require("../products/schemas/product.schema");
let OrdersService = class OrdersService {
    orderModel;
    productModel;
    constructor(orderModel, productModel) {
        this.orderModel = orderModel;
        this.productModel = productModel;
    }
    async create(createOrderDto, user) {
        const normalized = [];
        let total = 0;
        for (const line of createOrderDto.items) {
            const productId = new mongoose_2.Types.ObjectId(line.productId);
            const qty = Number(line.quantity) || 0;
            if (qty <= 0) {
                normalized.push({ productId, quantity: -1 });
                continue;
            }
            const doc = await this.productModel.findOneAndUpdate({ _id: productId, stock: { $gte: qty } }, { $inc: { stock: -qty } }, { new: false, projection: { price: 1 } });
            if (doc) {
                normalized.push({ productId, quantity: qty, priceSnapshot: doc.price });
                total += doc.price * qty;
            }
            else {
                normalized.push({ productId, quantity: -1 });
            }
        }
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
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message || 'Faild to fetch all orders');
        }
    }
    async findMyOrders(user) {
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
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message || 'Faild to fetch user orders');
        }
    }
    async updateOrderStatus(id, updateOrderDto) {
        try {
            return await this.orderModel.findByIdAndUpdate(id, {
                status: updateOrderDto.status,
            }, { new: true });
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message || 'Faild to update order status');
        }
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __param(1, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], OrdersService);
//# sourceMappingURL=orders.service.js.map