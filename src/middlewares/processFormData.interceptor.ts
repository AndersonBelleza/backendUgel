import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import * as multer from "multer";
import { catchError, from, Observable, switchMap } from "rxjs";

@Injectable()
export class PreprocessFormDataInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const upload = multer().none(); // Procesa solo el texto, no los archivos

    return from(new Promise((resolve, reject) => {
      upload(request, request.res, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(next.handle());
        }
      });
    })).pipe(
      switchMap((res: any) => res),
      catchError((error) => {
        throw new BadRequestException(`Error al procesar la solicitud: ${error.message}`);
      }),
    );
  }
}