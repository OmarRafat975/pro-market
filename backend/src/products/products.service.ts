import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/product.schema';
import { isValidObjectId, Model } from 'mongoose';
import { ProductsQueryDto } from './dto/products-query.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = await this.productModel.create(createProductDto);
      return product;
    } catch (error) {
      if (error.code === 11000)
        throw new ConflictException('Product already created');

      throw new BadRequestException(error.message || 'Faild to create product');
    }
  }

  async findAll(query?: ProductsQueryDto) {
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
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Failed to fetch products',
      );
    }
  }

  async findOne(id: string) {
    try {
      if (!isValidObjectId(id)) {
        throw new BadRequestException('Please provide a valid id');
      }

      const product = await this.productModel.findById(id);
      if (!product) throw new NotFoundException('Product not found');

      return product;
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to fetch product');
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Please provide a valid id');
    }
    try {
      const product = await this.productModel.findByIdAndUpdate(
        id,
        updateProductDto,
        { new: true, runValidators: true },
      );
      if (!product) throw new NotFoundException('Product not found');

      return product;
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Failed to update product',
      );
    }
  }

  async remove(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Please provide a valid id');
    }
    try {
      const product = await this.productModel.findByIdAndDelete(id);
      if (!product) throw new NotFoundException('Product not found');

      return {};
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
