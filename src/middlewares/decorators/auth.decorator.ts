import { applyDecorators, UseGuards } from "@nestjs/common";
import { Role } from "../role.enum";
import { AuthGuard } from '../auth.guard'
import { RolesGuard } from '../rol.guard'
import { Roles } from './rol.decorator'

export function Auth(...roles: Role[]){
    return applyDecorators(Roles(...roles), UseGuards(AuthGuard, RolesGuard));
}