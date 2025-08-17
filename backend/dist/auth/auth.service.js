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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const user_schema_1 = require("./schemas/user.schema");
const mongoose_2 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let AuthService = class AuthService {
    UserModel;
    jwtService;
    config;
    constructor(UserModel, jwtService, config) {
        this.UserModel = UserModel;
        this.jwtService = jwtService;
        this.config = config;
    }
    cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 15,
    };
    cookieAccessOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 15,
    };
    async register(registerData, res) {
        const { name, email, password } = registerData;
        const signedUser = await this.UserModel.findOne({
            email,
        });
        if (signedUser)
            throw new common_1.BadRequestException('Email already in use');
        const hashedPassword = await bcrypt_1.default.hash(password, 13);
        const user = await this.UserModel.create({
            email,
            name,
            password: hashedPassword,
        });
        const accessTokenRes = await this.createAccessToken(user.id, user.role, user.name);
        res.cookie('refresh_token', await this.createRefreshToken(user.id, user.role), this.cookieOptions);
        res.cookie('access_token', accessTokenRes.accessToken, this.cookieAccessOptions);
        return accessTokenRes;
    }
    async login(credentials, res) {
        const { email, password } = credentials;
        const user = await this.UserModel.findOne({ email });
        if (!user)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const isPwdMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isPwdMatch)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const accessTokenRes = await this.createAccessToken(user.id, user.role, user.name);
        res.cookie('refresh_token', await this.createRefreshToken(user.id, user.role), this.cookieOptions);
        res.cookie('access_token', accessTokenRes.accessToken, this.cookieAccessOptions);
        return accessTokenRes;
    }
    async logout(res) {
        res.cookie('refresh_token', '');
        res.cookie('access_token', '');
        return {};
    }
    async createAccessToken(userId, role, name) {
        const access_secret = this.config.get('JWT_ACCESS_SECRET');
        const accessToken = this.jwtService.sign({ userId, role, name }, {
            secret: access_secret,
            expiresIn: '10m',
        });
        return {
            accessToken,
            role,
            name,
        };
    }
    async createRefreshToken(userId, role) {
        const refresh_secret = this.config.get('JWT_REFRESH_SECRET');
        const refreshToken = this.jwtService.sign({ userId, role }, {
            secret: refresh_secret,
            expiresIn: '15d',
        });
        return refreshToken;
    }
    async refresh(payload, res) {
        const user = await this.UserModel.findById(payload.userId);
        if (!user)
            throw new common_1.UnauthorizedException('User Not Found');
        const accessTokenRes = await this.createAccessToken(user.id, user.role, user.name);
        res.cookie('refresh_token', await this.createRefreshToken(user.id, user.role), this.cookieOptions);
        res.cookie('access_token', accessTokenRes.accessToken, this.cookieAccessOptions);
        return accessTokenRes;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map