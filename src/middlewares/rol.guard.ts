import { CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from 'src/middlewares/decorators/rol.decorator'
import { Role } from 'src/middlewares/role.enum'
import { ALLROLL_KEY, PUBLIC_KEY,  STOPBODY_KEY } from "./decorators/key-decorator";
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Publico
    const isPublic = this.reflector.get<boolean>(
      PUBLIC_KEY,
      context.getHandler()
    )

    if(isPublic){
      return true;
    }

    // Todos los roles
    const allRoll = this.reflector.get<boolean>(
      ALLROLL_KEY,
      context.getHandler()
    )

    if(allRoll){
      return true;
    }

    const requiredRoles = this.reflector.getAllAndOverride<Role>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    const hasRequiredRole = requiredRoles.includes(user?.rol);
    
    if(!hasRequiredRole){
      throw new UnauthorizedException();
    }
    
    return hasRequiredRole;
  }
}