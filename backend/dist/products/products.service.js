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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const product_schema_1 = require("./schemas/product.schema");
const mongoose_2 = require("mongoose");
let ProductsService = class ProductsService {
    productModel;
    constructor(productModel) {
        this.productModel = productModel;
    }
    async create(createProductDto) {
        try {
            const product = await this.productModel.create(createProductDto);
            return product;
        }
        catch (error) {
            if (error.code === 11000)
                throw new common_1.ConflictException('Product already created');
            throw new common_1.BadRequestException(error.message || 'Faild to create product');
        }
    }
    async findAll(query) {
        try {
            const filter = query?.category ? { category: query?.category } : {};
            const limit = query?.limit || 10;
            const page = query?.page || 1;
            const skip = (page - 1) * limit;
            const [products, total, allCategories] = await Promise.all([
                this.productModel.find(filter).skip(skip).limit(limit),
                this.productModel.countDocuments(filter),
                this.productModel.distinct('category'),
            ]);
            const pages = Math.max(Math.ceil(total / limit), 1);
            return { products, total, pages, allCategories };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message || 'Failed to fetch products');
        }
    }
    async findOne(id) {
        try {
            if (!(0, mongoose_2.isValidObjectId)(id)) {
                throw new common_1.BadRequestException('Please provide a valid id');
            }
            const product = await this.productModel.findById(id);
            if (!product)
                throw new common_1.NotFoundException('Product not found');
            return product;
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message || 'Failed to fetch product');
        }
    }
    async update(id, updateProductDto) {
        if (!(0, mongoose_2.isValidObjectId)(id)) {
            throw new common_1.BadRequestException('Please provide a valid id');
        }
        try {
            const product = await this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true, runValidators: true });
            if (!product)
                throw new common_1.NotFoundException('Product not found');
            return product;
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message || 'Failed to update product');
        }
    }
    async remove(id) {
        if (!(0, mongoose_2.isValidObjectId)(id)) {
            throw new common_1.BadRequestException('Please provide a valid id');
        }
        try {
            const product = await this.productModel.findByIdAndDelete(id);
            if (!product)
                throw new common_1.NotFoundException('Product not found');
            return {};
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ProductsService);
//# sourceMappingURL=products.service.js.map