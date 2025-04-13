import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import Role from '../core/roles';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    
    if (!request.user) {
      throw new ForbiddenException('User not authenticated');
    }
    
    const { roles } = request.user;
    
    if (!roles.includes(Role.ADMIN)) {
      throw new ForbiddenException('Admin access required');
    }
    
    return true;
  }
}