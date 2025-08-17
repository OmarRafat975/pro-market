import { Roles } from '../schemas/user.schema';
export interface JwtUser {
    userId: string;
    role: Roles;
}
export declare const User: (...dataOrPipes: (keyof JwtUser | import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>> | undefined)[]) => ParameterDecorator;
