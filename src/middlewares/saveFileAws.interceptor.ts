// import { CallHandler, ExecutionContext, Injectable, NestInterceptor, BadRequestException, Type, mixin } from '@nestjs/common';
// import { extname } from 'path';
// import { catchError, from, Observable, of, switchMap } from 'rxjs';
// // import { createFolder, storage, verifyFolder } from 'src/libs';
// import { FileFieldsInterceptor } from '@nestjs/platform-express';

// @Injectable()
// export class SaveFileAws implements NestInterceptor {
//   constructor(private readonly name: string, private readonly maxCount: number) {}

//   async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
//     const request = context.switchToHttp().getRequest();
//     const { method, body, query } = request;

//     let directoryPath: string;

//     if (method === 'POST') {
//       directoryPath = body.pathFile;
//     } else if (method === 'GET') {
//       directoryPath = query.pathFile as string;
//     }

//     console.log("DIRECTORIO:", directoryPath);

//     if (!directoryPath) {
//       directoryPath = 'demo'
//       // throw new BadRequestException('No se especificó el directorio.');
//     }

//     // Verifica o crea la carpeta
//     await this.verifyOrCreateFolder(directoryPath);

//     const fileFilter = (req: any, file: any, callback: any) => {
//       const ext = extname(file.originalname);
//       const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf', '.xlsx'];


//       if (allowedExtensions.includes(ext.toLowerCase())) {
//         callback(null, true);
//       } else {
//         callback(new Error('Tipo de archivo no permitido'), false);
//       }
//     };

//     const multerStorage = storage(directoryPath);

//     const uploadInterceptor = new (FileFieldsInterceptor(
//       [{ name: this.name, maxCount: this.maxCount }],
//       {
//         fileFilter: fileFilter,
//         storage: multerStorage,
//       },
//     ))();

//     // Aquí manejamos el Promise y el Observable correctamente
//     return from(uploadInterceptor.intercept(context, next)).pipe(
//       // switchMap((res) => res),
//       switchMap((res) => {
//         // Aquí puedes acceder a los datos del request después de la carga de archivos
//         console.log(request.body);
//         return next.handle();
//       }),
//       catchError((error) => {
//         throw new BadRequestException(`Error al procesar la solicitud: ${error.message}`);
//       }),
//     );
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