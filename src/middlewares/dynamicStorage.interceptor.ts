import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
// import { storage } from 'src/libs';

@Injectable()
export class DynamicStorageInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { pathFile } = request.body;
    
    return next.handle().pipe(
      map((data) => {
        // Aquí puedes realizar acciones adicionales con el archivo subido
        // como actualizar una base de datos, enviar notificaciones, etc.
        return {
          message: 'Archivo subido correctamente',
          file: data,
          pathFile,
        };
      }),
      catchError((error) => {
        throw new BadRequestException(`Error al procesar la solicitud: ${error.message}`);
      }),
    );
  }
}
