import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Roles, User } from './schemas/user.schema';
import { Model } from 'mongoose';
import bcrypt from 'bcrypt';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CookieOptions, Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  private cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 15,
  };
  private cookieAccessOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 15,
  };

  async register(registerData: RegisterDto, res: Response) {
    const { name, email, password } = registerData;
    const signedUser = await this.UserModel.findOne({
      email,
    });
    if (signedUser) throw new BadRequestException('Email already in use');

    const hashedPassword = await bcrypt.hash(password, 13);

    const user = await this.UserModel.create({
      email,
      name,
      password: hashedPassword,
    });

    const accessTokenRes = await this.createAccessToken(
      user.id,
      user.role,
      user.name,
    );
    res.cookie(
      'refresh_token',
      await this.createRefreshToken(user.id, user.role),
      this.cookieOptions,
    );

    res.cookie(
      'access_token',
      accessTokenRes.accessToken,
      this.cookieAccessOptions,
    );

    return accessTokenRes;
  }

  async login(credentials: LoginDto, res: Response) {
    const { email, password } = credentials;

    const user = await this.UserModel.findOne({ email });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPwdMatch = await bcrypt.compare(password, user.password);
    if (!isPwdMatch) throw new UnauthorizedException('Invalid credentials');

    const accessTokenRes = await this.createAccessToken(
      user.id,
      user.role,
      user.name,
    );
    res.cookie(
      'refresh_token',
      await this.createRefreshToken(user.id, user.role),
      this.cookieOptions,
    );
    res.cookie(
      'access_token',
      accessTokenRes.accessToken,
      this.cookieAccessOptions,
    );
    return accessTokenRes;
  }
  async logout(res: Response) {
    res.cookie('refresh_token', '');
    res.cookie('access_token', '');
    return {};
  }

  async createAccessToken(userId: string, role: Roles, name: string) {
    const access_secret = this.config.get('JWT_ACCESS_SECRET');
    const accessToken = this.jwtService.sign(
      { userId, role, name },
      {
        secret: access_secret,
        expiresIn: '10m',
      },
    );

    return {
      accessToken,
      role,
      name,
    };
  }
  async createRefreshToken(userId: string, role: Roles) {
    const refresh_secret = this.config.get('JWT_REFRESH_SECRET');
    const refreshToken = this.jwtService.sign(
      { userId, role },
      {
        secret: refresh_secret,
        expiresIn: '15d',
      },
    );

    return refreshToken;
  }

  async refresh(payload: { userId: string; role: Roles }, res) {
    const user = await this.UserModel.findById(payload.userId);
    if (!user) throw new UnauthorizedException('User Not Found');
    const accessTokenRes = await this.createAccessToken(
      user.id,
      user.role,
      user.name,
    );
    res.cookie(
      'refresh_token',
      await this.createRefreshToken(user.id, user.role),
      this.cookieOptions,
    );
    res.cookie(
      'access_token',
      accessTokenRes.accessToken,
      this.cookieAccessOptions,
    );

    return accessTokenRes;
  }
}
