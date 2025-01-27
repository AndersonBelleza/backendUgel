import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config';

interface userRequest extends Request{
  user?: any;
}

@Injectable()
export class ValidateTokenMiddleware implements NestMiddleware {
  use(req: userRequest, res: Response, next: NextFunction) {
    let token: string | null = null;

    const queryToken = req.query.tokenE as string;
    const bodyToken = req.body.tokenE as string;

    token = queryToken || bodyToken;

    if(!token){
      return res.status(401).json({message: 'No hay un token creado, autorizacion denegada'})
    }
    
    jwt.verify(token, TOKEN_SECRET, (err, user) => {
        if(err){
            return res.status(403).json({message: 'Token inválido, authorizacion denegada'})
        }
        req.user = user;
        next();
    })
  }
}