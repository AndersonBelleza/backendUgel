// import { CallHandler, ExecutionContext, Injectable, NestInterceptor, BadRequestException, Type } from '@nestjs/common';
// import { extname } from 'path';
// import { from, Observable, of } from 'rxjs';
// import { catchError, switchMap, tap } from 'rxjs/operators';
// import { createFolder, storage, verifyFolder } from 'src/libs';
// import { FileFieldsInterceptor } from '@nestjs/platform-express';

// @Injectable()
// export class VerifyCreateFolderInterceptor implements NestInterceptor {
//   async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
//     const request = context.switchToHttp().getRequest();

//     // Obtener el path del directorio de la solicitud
//     let directoryPath: string;

//     if (request.method === 'POST') {
//       directoryPath = request.body.pathFile;
//     } else if (request.method === 'GET') {
//       directoryPath = request.query.pathFile as string;
//     }

//     console.log("EL DIRECTORIO ES:", directoryPath)
//     if (!directoryPath) {
//       throw new BadRequestException('No se especificó el directorio.');
//     }

//     try {
//       // Verificar o crear la carpeta
//       await this.verifyOrCreateFolder(directoryPath);

//       // Establecer el nuevo parámetro en el request para su uso posterior
//       request.body.pathFile = directoryPath;
//       request.query.pathFile = directoryPath;

//       return next.handle();
//     } catch (error) {
//       throw new BadRequestException(`Error al procesar la solicitud: ${error.message}`);
//     }
//   }

//   private async verifyOrCreateFolder(path: string): Promise<void> {
//     const result = await verifyFolder(path);

//     if (!result.exists) {
//       const createResult = await createFolder(path);
//       if (!createResult.success) {
//         throw new BadRequestException(createResult.message);
//       }
//     }
//   }
// }