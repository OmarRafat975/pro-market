import { RegisterDto } from './dtos/register.dto';
import { Roles, User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
export declare class AuthService {
    private UserModel;
    private readonly jwtService;
    private readonly config;
    constructor(UserModel: Model<User>, jwtService: JwtService, config: ConfigService);
    private cookieOptions;
    private cookieAccessOptions;
    register(registerData: RegisterDto, res: Response): Promise<{
        accessToken: string;
        role: Roles;
        name: string;
    }>;
    login(credentials: LoginDto, res: Response): Promise<{
        accessToken: string;
        role: Roles;
        name: string;
    }>;
    logout(res: Response): Promise<{}>;
    createAccessToken(userId: string, role: Roles, name: string): Promise<{
        accessToken: string;
        role: Roles;
        name: string;
    }>;
    createRefreshToken(userId: string, role: Roles): Promise<string>;
    refresh(payload: {
        userId: string;
        role: Roles;
    }, res: any): Promise<{
        accessToken: string;
        role: Roles;
        name: string;
    }>;
}
