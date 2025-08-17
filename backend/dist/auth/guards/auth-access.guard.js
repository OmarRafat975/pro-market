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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthAccessGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let AuthAccessGuard = class AuthAccessGuard {
    jwtService;
    config;
    constructor(jwtService, config) {
        this.jwtService = jwtService;
        this.config = config;
    }
    canActivate(context) {
        const req = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(req);
        if (!token)
            throw new common_1.UnauthorizedException('You need to login');
        const secret = this.config.get('JWT_ACCESS_SECRET');
        try {
            const payload = this.jwtService.verify(token, { secret });
            req.user = payload;
        }
        catch (error) {
            common_1.Logger.error(error.message);
            throw new common_1.UnauthorizedException('Invalid Token');
        }
        return true;
    }
    extractTokenFromHeader(request) {
        const token = request.headers?.authorization?.split(' ')[1] ||
            request?.cookies?.access_token;
        return token;
    }
};
exports.AuthAccessGuard = AuthAccessGuard;
exports.AuthAccessGuard = AuthAccessGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService])
], AuthAccessGuard);
//# sourceMappingURL=auth-access.guard.js.map