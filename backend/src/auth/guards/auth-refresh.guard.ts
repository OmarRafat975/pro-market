import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthRefreshGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = this.extractTokenFromCookies(req);
    if (!token) throw new UnauthorizedException('You need to login');
    const secret = this.config.getOrThrow('JWT_REFRESH_SECRET');
    try {
      const payload = this.jwtService.verify(token, { secret });
      req.user = payload;
    } catch (error) {
      Logger.error(error.message);
      throw new UnauthorizedException('Invalid Token');
    }
    return true;
  }

  private extractTokenFromCookies(request: Request): string | undefined {
    return request?.cookies?.refresh_token || '';
  }
}
