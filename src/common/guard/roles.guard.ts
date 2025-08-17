import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthUser } from 'src/modules/auth/jwt.strategy';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // get required roles from @Roles decorator
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());

    const request = context.switchToHttp().getRequest<{ user?: AuthUser }>();
    const user = request.user;

    if (!user) throw new ForbiddenException('Access denied');

    // If no roles are specified on the route, allow all logged-in users
    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // everyone logged-in can access
    }

    // If roles are defined, check if user's role is included
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }
}

