import {CanActivate,ExecutionContext,Injectable,UnauthorizedException} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
  
  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService,
        private configService: ConfigService,
    ) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      if (!token) {
        throw new UnauthorizedException('You need to be signed in');
      }

      try {
        const payload = await this.jwtService.verifyAsync(
          token,
          {
            secret: this.configService.get<string>('AUTH_JWT_SECRET'),
            audience: this.configService.get<string>('JWT_AUDIENCE'),
            issuer: this.configService.get<string>('JWT_ISSUER')
          }
        );

        request.user = {
          id: payload.sub,
          roles:payload.roles,
          email:payload.email
        };

      } catch(err) {
        if (err.name === 'TokenExpiredError') {
            throw new UnauthorizedException('Token has expired');
          } else {
            throw new UnauthorizedException('Invalid authentication token');
          }
      }
      return true;
    }
  
    private extractTokenFromHeader(request: Request): string | undefined {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    }
}
  