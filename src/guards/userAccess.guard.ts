import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import Role from '../core/roles';

@Injectable()
export class CheckUserAccessGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    
    if (!request.user) {
      throw new ForbiddenException('User not authenticated');
    }
    
    const { id: userId, roles } = request.user;
    const id = request.params.id;
    if (id !== 'me' && id !== String(userId) && !roles.includes(Role.ADMIN)) {
      throw new ForbiddenException("You are not allowed to view this user's information");
    }

    return true;
  }
}