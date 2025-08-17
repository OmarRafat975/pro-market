import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import type { Response } from 'express';
import { type JwtUser } from './decorators/user.decorator';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerData: RegisterDto, res: Response): Promise<{
        accessToken: string;
        role: import("./schemas/user.schema").Roles;
        name: string;
    }>;
    login(credentials: LoginDto, res: Response): Promise<{
        accessToken: string;
        role: import("./schemas/user.schema").Roles;
        name: string;
    }>;
    logout(res: Response): Promise<{}>;
    refresh(user: JwtUser, res: Response): Promise<{
        accessToken: string;
        role: import("./schemas/user.schema").Roles;
        name: string;
    }>;
}
