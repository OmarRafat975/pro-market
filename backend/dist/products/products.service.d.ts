import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './schemas/product.schema';
import { Model } from 'mongoose';
import { ProductsQueryDto } from './dto/products-query.dto';
export declare class ProductsService {
    private readonly productModel;
    constructor(productModel: Model<Product>);
    create(createProductDto: CreateProductDto): Promise<import("mongoose").Document<unknown, {}, Product, {}, {}> & Product & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    findAll(query?: ProductsQueryDto): Promise<{
        products: (import("mongoose").Document<unknown, {}, Product, {}, {}> & Product & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
        total: number;
        pages: number;
        allCategories: string[];
    }>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, Product, {}, {}> & Product & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<import("mongoose").Document<unknown, {}, Product, {}, {}> & Product & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    remove(id: string): Promise<{}>;
}
