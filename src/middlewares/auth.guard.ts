import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core'
import { TOKEN_SECRET } from 'src/config';
import { Request } from 'express';
import { PUBLIC_KEY, STOPBODY_KEY } from './decorators/key-decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector
    ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(
      PUBLIC_KEY,
      context.getHandler()
    )

    if(isPublic){
      return true;
    }
    
    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: TOKEN_SECRET,
      });
      request.user = payload;
    } catch (error) {
      throw new UnauthorizedException();
    }

    return true;
  }


  private extractToken(request: Request) {
    let token: string | undefined;
    let tokenU: string | undefined;

    if(request.method == 'GET'){
      const tokens = this.extractTokenFromQueryParams(request);
      token = tokens.token;
      tokenU = tokens.tokenU
    }else{
      const tokens = this.extractTokenFromBody(request);
      
      token = tokens.token;
      tokenU = tokens.tokenU
    }
    return {token, tokenU};
  }
  

  // Este es desde la cabecera
  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }

  // Este es desde el body
  private extractTokenFromBody(request: Request) {
    const token = request.body?.token;
    const tokenU = request.body?.tokenU;
    return { token, tokenU };
  }

  // Esto es desde el param
  private extractTokenFromQueryParams(request: Request) {
    const token = request.query.token as string;
    const tokenU = request.query.tokenU as string;
    return { token, tokenU };
  }
}
