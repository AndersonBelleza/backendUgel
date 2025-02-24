
// import {
//     S3,
//     S3Client,
//     DeleteObjectCommand,
//     HeadObjectCommandOutput,
//     DeleteObjectsCommand,
//     DeleteObjectsCommandOutput,
//     HeadObjectCommand,
//     PutObjectCommand,
//     ListObjectsV2Command,
//     ListObjectsV2CommandOutput,
//     CopyObjectCommand,
//     CopyObjectCommandOutput,
//     DeleteObjectCommandOutput,
//     PutObjectCommandOutput,
//     ObjectCannedACL,
//     GetObjectCommand,
//     GetObjectCommandInput,
//     _Object,
//     ListBucketsCommand,
//     GetBucketAclCommand
// } from '@aws-sdk/client-s3';
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
// // import { createPresignedUrl } from '@aws-sdk/s3-presigned-url';
// import * as multerS3 from 'multer-s3';
// // import * as multer from 'multer';
// import { extname } from 'path';
// import { randomUUID } from 'crypto';
// import { BadRequestException } from '@nestjs/common';
// import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
// import multer from 'multer';
// import { Upload } from '@aws-sdk/lib-storage';

// //nuevo space
// const BUCKET_NAME = 'semi'
// const AWS_ACCESS_KEY_ID = 'DO00MV93QHHDGFNN7UGE'
// const AWS_SECRET_ACCESS_KEY = 'KFEYnLmh6rmCF73QiiKKyZafLcrEjnrnU7y4y6RjdXg'
// const S3_ENDPOINT = 'https://nyc3.digitaloceanspaces.com'
// const S3_PATH_FILE = `https://${BUCKET_NAME}.nyc3.digitaloceanspaces.com`

// const s3Client = new S3Client({
//     endpoint: S3_ENDPOINT,
//     // region: 'us-west-1',
//     region: 'us-east-1',
//     credentials: {
//         accessKeyId: AWS_ACCESS_KEY_ID,
//         secretAccessKey: AWS_SECRET_ACCESS_KEY,
//     },
// });


// const getPathFile = (bucket: string) => {
//     // return `https://${bucket}.sfo3.digitaloceanspaces.com`
//     return `https://${bucket}.nyc3.digitaloceanspaces.com`
// }

// // Función para convertir bytes a una unidad legible
// const formatSize = (bytes: number) => {
//     if (bytes >= 1e24) return (bytes / 1e24).toFixed(2) + ' YB'; // Yottabytes
//     if (bytes >= 1e21) return (bytes / 1e21).toFixed(2) + ' ZB'; // Zettabytes
//     if (bytes >= 1e18) return (bytes / 1e18).toFixed(2) + ' EB'; // Exabytes
//     if (bytes >= 1e15) return (bytes / 1e15).toFixed(2) + ' PB'; // Petabytes
//     if (bytes >= 1e12) return (bytes / 1e12).toFixed(2) + ' TB'; // Terabytes
//     if (bytes >= 1e9) return (bytes / 1e9).toFixed(2) + ' GB'; // Gigabytes
//     if (bytes >= 1e6) return (bytes / 1e6).toFixed(2) + ' MB'; // Megabytes
//     if (bytes >= 1e3) return (bytes / 1e3).toFixed(2) + ' KB'; // Kilobytes
//     return bytes + ' bytes';
// };

// // Función para asegurarse de que el prefijo termina con '/'
// export const ensureTrailingSlash = (prefix: string) => {
//     if (!prefix || prefix == '') {
//         return '';
//     }
//     return prefix.endsWith('/') ? prefix : prefix + '/';
// };

// export const removeTrailingSlash = (text: string): string => {
//     return text.endsWith('/') ? text.slice(0, -1) : text;
// };

// const getLastSegment = (path: string) => {
//     // Asegúrate de que la ruta esté en formato de cadena
//     if (typeof path !== 'string') {
//         throw new TypeError('The path should be a string.');
//     }

//     // Dividir la ruta por el delimitador '/' y obtener el último segmento
//     return path.split('/').filter(Boolean).pop();
// };

// const getFileType = (filename: string) => {
//     // Definir las extensiones por tipo de archivo
//     const fileTypes = {
//         audio: ['.mp3', '.wav', '.aac', '.flac', '.ogg'],
//         video: ['.mp4', '.avi', '.mov', '.mkv', '.flv'],
//         image: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff'],
//         document: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'],
//         other: [] // Puedes agregar más extensiones si es necesario
//     };

//     // Obtener la extensión del archivo
//     const extension = filename.substring(filename.lastIndexOf('.')).toLowerCase();

//     // Determinar el tipo de archivo basado en la extensión
//     for (const [type, extensions] of Object.entries(fileTypes)) {
//         if (extensions.includes(extension)) {
//             return type;
//         }
//     }

//     // Si no coincide con ninguna categoría, devolver 'other'
//     return 'other';
// };



// export const storage = (path?: string) => multerS3({
//     s3: s3Client,
//     bucket: BUCKET_NAME,
//     acl: 'public-read',
//     metadata: (req: any, file: any, cb) => {
//         cb(null, { fieldname: file.fieldname });
//     },
//     key: (req: any, file: any, cb) => {
//         let pathFile = req.body?.pathFile;

//         if (!pathFile) {
//             pathFile = 'demo/formdata30_07_2024';
//         }

//         const fileName = `${path ? path + "/" : ""}${randomUUID()}${extname(file.originalname)}`;
//         cb(null, fileName);
//     },
// });


// export const storageSdk = (path?: string): MulterOptions => ({
//     fileFilter: (req, file, callback) => {
//         const ext = extname(file.originalname);
//         const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf', '.xlsx'];
//         // ("REQ ES:", req?.body)

//         if (allowedExtensions.includes(ext.toLowerCase())) {
//             callback(null, true);
//         } else {
//             callback(new BadRequestException('EL tipo de archivo no es permitido'), false);
//         }
//     },
//     storage: multerS3({
//         s3: s3Client,
//         bucket: BUCKET_NAME,
//         acl: ObjectCannedACL.public_read,
//         metadata: (req, file, cb) => {
//             // ("MDTA REQ ES:", req)
//             cb(null, { fieldname: file.fieldname });
//         },
//         key: async (req: any, file, cb) => {
//             // Obtener algún atributo del FormData para determinar el path
//             let pathFile = req?.body?.pathFile; // Usa el atributo que necesites del FormData
//             // ("FILES ES:", pathFile, path)

//             if (!pathFile) {
//                 pathFile = 'NotFound';
//             }

//             if (path) {
//                 pathFile = path;
//             }

//             await verifyOrCreateFolder(pathFile);
//             const fileName = `${pathFile ? ensureTrailingSlash(pathFile) : ''}${randomUUID()}${extname(file.originalname)}`;
//             cb(null, fileName);
//         },
//     }),
// });



// interface InfoDetObjects {
//     Key: string;
// }

// interface DeleteObjects {
//     Objects: InfoDetObjects[]
// }

// interface VerifyFolderResult {
//     exists: boolean;
//     message: string;
// }


// interface FileDetail {
//     Key: string;
//     LastModified: Date;
//     ETag: string;
//     Size: number;
//     StorageClass: string;
//     Metadata: Record<string, string>; // Información adicional
//     Location: string;
// }

// interface ListFilesResult {
//     files: FileDetail[];
//     message: string;
// }

// interface DeleteObjectsResult {
//     deleted: number;
//     failed: number;
//     message: string;
// }

// interface MoveObjectResult {
//     success: boolean;
//     message: string;
// }

// interface DeletePathResult {
//     deleted: boolean;  // Cambiado a booleano para reflejar si se eliminó el objeto
//     failed: number;    // Siempre será 0 en este caso, ya que se maneja un solo objeto
//     message: string;
// }

// interface DeleteResult {
//     deleted: number;
//     failed: number;
//     message: string;
//     errors?: any[];
// }


// interface DeleteFilesResult {
//     success: boolean;
//     message: string;
//     deletedCount: number;
//     failedCount: number;
// }

// interface CreateFolderResult {
//     success: boolean;
//     message: string;
//     data?: any; // Puedes ajustar el tipo de `data` según lo que necesites
//     error?: any; // Opcional, para almacenar detalles del error si ocurre
// }

// interface DeleteFilesResult {
//     success: boolean;
//     message: string;
//     deletedCount: number;
//     failedCount: number;
// }

// // Interfaz para los parámetros de entrada
// interface UploadFileS3Params {
//     file: Express.Multer.File;
//     destinationPath: string;
// }

// interface UploadFilesS3Params {
//     bucket?: string;
//     files: Express.Multer.File[];
//     destinationPath: string;
// }


// interface UploadFileS3ResultSuccess {
//     key: string;
//     name: string;
//     fileType: string;
//     size: number;
//     sizeFormatted: string;
//     location: string;
// }

// interface UploadFileS3ResultError {
//     message: string;
//     code?: string;
// }

// // Interfaz para el resultado exitoso
// interface UploadFileS3Result {
//     success: boolean;
//     message?: string;
//     data?: any; // Cambia a un tipo más específico si conoces la forma exacta del resultado
//     code?: string;
//     error?: UploadFileS3ResultError
// }

// interface ShareObjectResult {
//     success: boolean;
//     message: string;
//     urls?: string[];
// }


// // Validación de extensiones permitidas
// const allowedExtensions = [
//     // Document files
//     '.doc', '.docx', '.odt', '.pdf', '.rtf', '.txt', '.pages',
//     // Spreadsheet files
//     '.xls', '.xlsx', '.ods', '.numbers', '.csv',
//     // Presentation files
//     '.ppt', '.pptx', '.odp', '.key',
//     // Image files
//     '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff',
//     // Audio files
//     '.mp3', '.wav', '.m4a',
//     // Video files
//     '.mp4', '.mov', '.avi', '.wmv',
//     // Archive files
//     '.zip', '.rar', '.7z',
//     // Other common file types
//     '.java', '.py', '.cpp'
// ];


// // const allowedExtensions = [
// //     '.jpg', '.jpeg', '.png',
// //     '.pdf', '.xlsx', '.zip',
// //     '.rar', '.doc', '.docx',
// //     '.xls', '.txt'
// // ];




// /**
//  * UPLOADS
//  * @param UploadFileS3Params
//  * @returns 
//  */
// export const uploadFileS3 = async ({ file, destinationPath }: UploadFileS3Params): Promise<UploadFileS3Result> => {
//     try {
//         const fileName = randomUUID() + extname(file.originalname);
//         const path = ensureTrailingSlash(destinationPath) + fileName;

//         const pathFolder = removeTrailingSlash(destinationPath);
//         await verifyOrCreateFolder(pathFolder);

//         const ext = extname(file.originalname);
//         if (!allowedExtensions.includes(ext.toLowerCase())) {
//             return {
//                 success: false,
//                 message: 'EL tipo de archivo no es permitido'
//             };
//         }

//         const params = {
//             Bucket: BUCKET_NAME,
//             Key: path,
//             Body: file.buffer,
//             ContentType: file.mimetype,
//             ACL: ObjectCannedACL.public_read_write
//         };

//         const res = await s3Client.send(new PutObjectCommand(params));
//         return {
//             success: true,
//             message: 'Archivo subido exitosamente',
//             data: {
//                 $metadata: res.$metadata,
//                 key: path,
//                 name: fileName,
//                 fileType: file.mimetype,
//                 size: file.buffer.length,
//                 sizeFormatted: formatSize(file.buffer.length),
//                 location: `${S3_PATH_FILE}/${path}`
//             },
//         };
//     } catch (error) {
//         return {
//             success: false,
//             message: 'Error al subir archivo a S3',
//             code: error.code, // Puedes agregar otros detalles del error según lo necesites
//         };
//     }
// }

// export const uploadFileS3Many = async ({ files, destinationPath, bucket = BUCKET_NAME }: UploadFilesS3Params): Promise<UploadFileS3Result> => {
//     const uploadedFiles: UploadFileS3ResultSuccess[] = [];
//     let error: UploadFileS3ResultError | undefined;

//     try {
//         // Verifica o crea la carpeta de destino
//         const path = removeTrailingSlash(destinationPath);
//         await verifyOrCreateFolder(path);

//         for (const file of files) {
//             const ext = extname(file.originalname).toLowerCase();

//             if (!allowedExtensions.includes(ext)) {
//                 error = {
//                     message: `EL tipo de archivo ${file.originalname} no es permitido`,
//                 };
//                 continue;
//             }

//             // Crear el nombre del archivo y el path en S3
//             const fileName = `${randomUUID()}${ext}`;
//             const path = ensureTrailingSlash(destinationPath) + fileName;

//             // Parámetros para la carga en S3
//             const params = {
//                 Bucket: bucket,
//                 Key: path,
//                 Body: file.buffer,
//                 ContentType: file.mimetype,
//                 ACL: ObjectCannedACL.public_read_write,
//             };

//             // Subir el archivo a S3
//             try {
//                 const res = await s3Client.send(new PutObjectCommand(params));

//                 uploadedFiles.push({
//                     key: path,
//                     name: fileName,
//                     fileType: file.mimetype,
//                     size: file.buffer.length,
//                     sizeFormatted: formatSize(file.buffer.length),
//                     location: `${getPathFile(bucket)}/${path}`
//                 });
//             } catch (uploadError) {
//                 error = {
//                     message: `Error al subir el archivo ${file.originalname} a S3`,
//                     code: uploadError?.code,
//                 };
//             }
//         }
//     } catch (generalError) {
//         error = {
//             message: 'Error general al subir archivos a S3',
//             code: generalError?.code,
//         };
//     }

//     return {
//         success: error ? false : true,
//         message: error ? error.message : 'Archivos subidos exitosamente',
//         data: uploadedFiles.length > 0 ? uploadedFiles : undefined,
//         error: error,
//     };
// };


// /**
//  * 
//  * @param path File or Folder path / Ruta del archivo o folder
//  */
// export const deletePath = async (path: string): Promise<DeletePathResult> => {
//     try {
//         const res: DeleteObjectCommandOutput = await s3Client.send(new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: path }));

//         // Verifica el código de estado HTTP para asegurar que la eliminación fue exitosa
//         if (res.$metadata.httpStatusCode === 204) { // 204 No Content indica que la eliminación fue exitosa
//             return {
//                 deleted: true,
//                 failed: 0,
//                 message: `El objeto '${path}' fue eliminado exitosamente.`,
//             };
//         } else {
//             return {
//                 deleted: false,
//                 failed: 1,
//                 message: `No se pudo eliminar el objeto '${path}'.`,
//             };
//         }
//     } catch (error) {
//         return {
//             deleted: false,
//             failed: 1,
//             message: `Error al eliminar el objeto '${path}': ${error.message}`,
//         };
//     }
// };

// export const deletePaths = async (paths: DeleteObjects): Promise<DeleteResult> => {
//     if (!paths || !Array.isArray(paths.Objects) || paths.Objects.length === 0) {
//         return { deleted: 0, failed: 0, message: 'No se proporcionaron rutas para eliminar.' };
//     }

//     try {
//         const res: DeleteObjectsCommandOutput = await s3Client.send(new DeleteObjectsCommand({
//             Bucket: BUCKET_NAME,
//             Delete: paths
//         }));

//         const deletedCount = res.Deleted ? res.Deleted.length : 0;
//         const failedCount = res.Errors ? res.Errors.length : 0;

//         return {
//             deleted: deletedCount,
//             failed: failedCount,
//             message: `Se eliminaron ${deletedCount} objetos. ${failedCount > 0 ? `Fallaron ${failedCount} eliminaciones.` : ''}`,
//             errors: res.Errors || []
//         };
//     } catch (error) {
//         console.error('Error al eliminar archivos:', error);
//         return {
//             deleted: 0,
//             failed: paths.Objects.length,
//             message: `Error al eliminar los archivos: ${error.message}`,
//             errors: [error]
//         };
//     }
// };



// export const deleteFilesInFolders = async (folderPaths: string[]): Promise<DeleteFilesResult[]> => {
//     const results: DeleteFilesResult[] = [];
//     for (const folderPath of folderPaths) {
//         // Asegurarse de que el prefix tenga '/' al final
//         const formattedPrefix = ensureTrailingSlash(folderPath)

//         try {
//             const listParams = {
//                 Bucket: 'BUCKET_NAME',
//                 Prefix: formattedPrefix,
//                 Delimiter: '/' // Evitar listar objetos en subcarpetas
//             };

//             const listResponse = await s3Client.send(new ListObjectsV2Command(listParams));
//             const objects = listResponse.Contents || [];

//             let deletedCount = 0;
//             let failedCount = 0;

//             for (const object of objects) {
//                 if (object.Key && !object.Key.endsWith('/')) { // Verificar que no sea una subcarpeta
//                     const deleteParams = {
//                         Bucket: 'BUCKET_NAME',
//                         Key: object.Key
//                     };

//                     try {
//                         await s3Client.send(new DeleteObjectCommand(deleteParams));
//                         deletedCount++;
//                     } catch (error) {
//                         console.error(`Error al eliminar el archivo '${object.Key}': ${error.message}`);
//                         failedCount++;
//                     }
//                 }
//             }

//             results.push({
//                 success: deletedCount > 0,
//                 message: `Se eliminaron ${deletedCount} archivos de la carpeta '${folderPath}'.`,
//                 deletedCount,
//                 failedCount
//             });
//         } catch (error) {
//             results.push({
//                 success: false,
//                 message: `Error al listar o eliminar archivos de la carpeta '${folderPath}': ${error.message}`,
//                 deletedCount: 0,
//                 failedCount: 0
//             });
//         }
//     }

//     return results;
// };

// export const verifyObject = async (path: string) => {
//     try {
//         const res = await s3Client.send(new HeadObjectCommand({
//             Bucket: BUCKET_NAME,
//             Key: path
//         }));
//         return { exists: true, message: `El objeto '${path}' existe.`, data: res };
//     } catch (error) {
//         if (error.name === 'NotFound') {
//             return { exists: false, message: `El objeto '${path}' no existe.` };
//         }
//         return { exists: false, message: `Error al verificar el objeto: ${error.message}` };
//     }
// };

// export const verifyFolder = async (path: string): Promise<VerifyFolderResult> => {
//     try {
//         // Asegurarse de que el prefix tenga '/' al final
//         const normalizedPath  = ensureTrailingSlash(path)
//         // ("ENSURE PATH:", normalizedPath)
//         const res = await s3Client.send(new ListObjectsV2Command({
//             Bucket: BUCKET_NAME,
//             Prefix: normalizedPath ,
//             Delimiter: '/', // Considerar solo los objetos dentro de la "carpeta"
//             MaxKeys: 1 // Solo necesitamos un objeto para verificar si la carpeta existe
//         }));

//         // ("RES VERIFY: ", res)

//         if (res.Contents && res.Contents.length > 0) {
//             return { exists: true, message: `La carpeta '${path}' existe.` };
//         } else {
//             return { exists: false, message: `La carpeta '${path}' no existe.` };
//         }
//     } catch (error) {
//         return { exists: false, message: `Error al verificar la carpeta: ${error.message}` };
//     }
// };


// /**
//  * *******************************************************************************
//  * PARA FOLDER
//  * *******************************************************************************
//  */

// /**
//  * 
//  * @param path Path or Folder name
//  */
// export const createFolder = async (path: string): Promise<CreateFolderResult> => {
//     try {
//         const folderPath = ensureTrailingSlash(path)
//         const res: PutObjectCommandOutput = await s3Client.send(new PutObjectCommand({
//             Bucket: BUCKET_NAME,
//             Key: folderPath,
//             Body: '', // Un cuerpo vacío para crear la "carpeta"
//             ACL: ObjectCannedACL.public_read_write,
//         }));

//         return {
//             success: true,
//             message: `Carpeta '${folderPath}' creada con éxito.`,
//             data: res // Incluye la respuesta del comando PutObject
//         };
//     } catch (error) {
//         ("error ",error);
        
//         return {
//             success: false,
//             message: `Error al crear la carpeta '${path}': ${error.message}`,
//             error: error // Incluye detalles del error
//         };
//     }
// };

// export const deleteFolder = async (path: string): Promise<DeleteObjectsResult> => {
//     try {
//         let continuationToken: string | undefined;
//         let totalDeleted = 0;
//         let totalFailed = 0;
//         const folderPath = removeTrailingSlash(path)

//         do {
//             // Listar objetos dentro de la carpeta
//             const listParams = {
//                 Bucket: BUCKET_NAME,
//                 Prefix: folderPath,
//                 ContinuationToken: continuationToken
//             };

//             const listResponse: ListObjectsV2CommandOutput = await s3Client.send(new ListObjectsV2Command(listParams));

//             if (!listResponse.Contents || listResponse.Contents.length === 0) {
//                 break;
//             }

//             // Eliminar objetos listados
//             const deleteParams = {
//                 Bucket: BUCKET_NAME,
//                 Delete: {
//                     Objects: listResponse.Contents.map(objeto => ({ Key: objeto.Key! })),
//                 },
//             };

//             const deleteResponse: DeleteObjectsCommandOutput = await s3Client.send(new DeleteObjectsCommand(deleteParams));
//             totalDeleted += deleteResponse.Deleted?.length || 0;
//             totalFailed += deleteResponse.Errors?.length || 0;

//             // Obtener el token para la siguiente página de objetos
//             continuationToken = listResponse.NextContinuationToken;

//         } while (continuationToken);

//         return {
//             deleted: totalDeleted,
//             failed: totalFailed,
//             message: `Se eliminaron ${totalDeleted} objetos de la carpeta '${folderPath}'.`,
//         };
//     } catch (error) {
//         return { deleted: 0, failed: 0, message: `Error al eliminar la carpeta: ${error.message}` };
//     }
// };

// export const deleteFilesInFolder = async (folderPath: string): Promise<DeleteFilesResult> => {
//     try {
//         const listParams = {
//             Bucket: BUCKET_NAME,
//             Prefix: folderPath + '/',
//             Delimiter: '/' // Utiliza Delimiter para evitar listar objetos en subcarpetas
//         };

//         const listResponse = await s3Client.send(new ListObjectsV2Command(listParams));
//         const objects = listResponse.Contents || [];

//         let deletedCount = 0;
//         let failedCount = 0;

//         for (const object of objects) {
//             if (object.Key && !object.Key.endsWith('/')) { // Verificar que no sea una subcarpeta
//                 const deleteParams = {
//                     Bucket: BUCKET_NAME,
//                     Key: object.Key
//                 };

//                 try {
//                     await s3Client.send(new DeleteObjectCommand(deleteParams));
//                     deletedCount++;
//                 } catch (error) {
//                     console.error(`Error al eliminar el archivo '${object.Key}': ${error.message}`);
//                     failedCount++;
//                 }
//             }
//         }

//         return {
//             success: deletedCount > 0,
//             message: `Se eliminaron ${deletedCount} archivos de la carpeta '${folderPath}'.`,
//             deletedCount,
//             failedCount
//         };
//     } catch (error) {
//         return {
//             success: false,
//             message: `Error al listar o eliminar archivos de la carpeta '${folderPath}': ${error.message}`,
//             deletedCount: 0,
//             failedCount: 0
//         };
//     }
// };


// export const verifyOrCreateFolder = async (path: string): Promise<void> => {
//     const folderPath = ensureTrailingSlash(path)
//     const result = await verifyFolder(folderPath);
//     if (!result.exists) {
//         const createResult = await createFolder(folderPath);
//         if (!createResult.success) {
//             throw new BadRequestException(createResult.message);
//         }
//     }
// }


// export const copyFolder = async (sourceFolder: string, destinationFolder: string) => {
//     // Asegurar que ambos nombres de carpeta terminen con '/'
//     const sourcePrefix = sourceFolder.endsWith('/') ? sourceFolder : `${sourceFolder}/`;
//     const destinationPrefix = destinationFolder.endsWith('/') ? destinationFolder : `${destinationFolder}/`;

//     try {
//         // Listar objetos en la carpeta origen
//         const listParams = {
//             Bucket: BUCKET_NAME,
//             Prefix: sourcePrefix,
//         };

//         const data = await s3Client.send(new ListObjectsV2Command(listParams));
//         const objects = data.Contents || [];

//         // Copiar cada objeto de la carpeta origen a la carpeta destino
//         for (const object of objects) {
//             const sourceKey = object.Key;
//             const destinationKey = sourceKey.replace(sourcePrefix, destinationPrefix);

//             if (sourceKey) {
//                 const copyParams = {
//                     Bucket: BUCKET_NAME,
//                     CopySource: `${BUCKET_NAME}/${sourceKey}`,
//                     Key: destinationKey,
//                 };

//                 await s3Client.send(new CopyObjectCommand(copyParams));
//                 // (`Copiado: ${sourceKey} a ${destinationKey}`);
//             }
//         }

//         // (`Copia de la carpeta '${sourceFolder}' a '${destinationFolder}' completada.`);
//         return { success: true, message: `Copia de la carpeta '${sourceFolder}' a '${destinationFolder}' completada.` };
//     } catch (error) {
//         console.error('Error al copiar la carpeta:', error);
//         return { success: false, message: `Error al copiar la carpeta: ${error.message}.` };
//     }
// };


// export const renameS3Folder = async (oldFolder: string, newFolder: string) => {
//     try {
//         const prefixOld = removeTrailingSlash(oldFolder);
//         const prefixNew = removeTrailingSlash(newFolder);

//         const existFolder = await verifyFolder(prefixNew + '/');
//         if (existFolder.exists) {
//             return {
//                 success: false,
//                 message: `La carpeta ${prefixNew} ya existe en el mismo directorio.`
//             };
//         }

//         // Listar objetos en la carpeta antigua
//         const listCommand = new ListObjectsV2Command({
//             Bucket: BUCKET_NAME,
//             Prefix: `${prefixOld}`
//         });

//         const { Contents } = await s3Client.send(listCommand);

//         if (!Contents || Contents.length === 0) {
//             return {
//                 success: false,
//                 message: 'No se encontraron objetos en la carpeta antigua.'
//             };
//         }

//         // Copiar objetos a la nueva carpeta
//         for (const object of Contents) {
//             const oldKey = object.Key;
//             const newKey = oldKey.replace(prefixOld, prefixNew);

//             // Copiar objeto a la nueva carpeta
//             const copySource = `${BUCKET_NAME}/${encodeURIComponent(oldKey)}`;

//             await s3Client.send(new CopyObjectCommand({
//                 Bucket: BUCKET_NAME,
//                 // CopySource: `${BUCKET_NAME}/${oldKey}`,
//                 CopySource: copySource,
//                 Key: newKey,
//                 ACL: ObjectCannedACL.public_read_write,
//             }));
//         }

//         // Eliminar objetos de la carpeta antigua
//         for (const object of Contents) {
//             const oldKey = object.Key;

//             await s3Client.send(new DeleteObjectCommand({
//                 Bucket: BUCKET_NAME,
//                 Key: oldKey
//             }));
//         }

//         return {
//             success: true,
//             message: `Carpeta renombrada de ${prefixOld} a ${prefixNew} exitosamente.`
//         };
//     } catch (error) {
//         return {
//             success: false,
//             message: `Error al renombrar la carpeta: ${error.message}`
//         };
//     }
// }


// export const listFolders = async () => {
//     try {
//         let isTruncated = true;
//         let ContinuationToken = null;
//         const carpetas = new Set<string>();

//         while (isTruncated) {
//             const { Contents, IsTruncated, NextContinuationToken } = await s3Client.send(new ListObjectsV2Command({
//                 Bucket: BUCKET_NAME,
//                 ContinuationToken
//             }));

//             Contents?.forEach(objeto => {
//                 const key = objeto.Key;
//                 if (key.endsWith('/')) {
//                     carpetas.add(key);
//                 } else {
//                     const parts = key.split('/');
//                     for (let i = 1; i < parts.length; i++) {
//                         carpetas.add(parts.slice(0, i).join('/') + '/');
//                     }
//                 }
//             });

//             isTruncated = IsTruncated;
//             ContinuationToken = NextContinuationToken;
//         }

//         return Array.from(carpetas);
//     } catch (error) {
//         console.error(`Error al listar carpetas: ${error.message}`);
//     }
// };

// export const listFilesInRoot = async (): Promise<ListFilesResult> => {
//     try {
//         const listParams = {
//             Bucket: BUCKET_NAME,
//             Delimiter: '/', // Limita la lista a objetos directamente en la raíz
//         };

//         const res: ListObjectsV2CommandOutput = await s3Client.send(new ListObjectsV2Command(listParams));

//         if (res.Contents && res.Contents.length > 0) {
//             // Filtra los objetos para asegurarse de que solo se devuelvan los archivos y no carpetas
//             const fileDetails: FileDetail[] = await Promise.all(
//                 res.Contents.filter(objeto => !objeto.Key!.includes('/')) // Filtra para asegurarse de que los archivos están en la raíz
//                     .map(async (objeto) => {
//                         const headRes: HeadObjectCommandOutput = await s3Client.send(new HeadObjectCommand({
//                             Bucket: BUCKET_NAME,
//                             Key: objeto.Key!,
//                         }));
//                         return {
//                             Key: objeto.Key!,
//                             LastModified: objeto.LastModified!,
//                             ETag: objeto.ETag!,
//                             Size: objeto.Size!,
//                             StorageClass: objeto.StorageClass!,
//                             Metadata: headRes.Metadata || {}, // Información adicional
//                             Location: `${S3_PATH_FILE}/${objeto.Key}` // Ajusta la URL según tu configuración
//                         };
//                     })
//             );

//             return { files: fileDetails, message: `Archivos listados exitosamente en la raíz del bucket.` };
//         } else {
//             return { files: [], message: `No se encontraron archivos en la raíz del bucket.` };
//         }
//     } catch (error) {
//         return { files: [], message: `Error al listar los archivos en la raíz del bucket: ${error.message}` };
//     }
// };

// export const listFilesInFolder = async (folderPath: string): Promise<ListFilesResult> => {
//     try {
//         const listParams = {
//             Bucket: BUCKET_NAME,
//             Prefix: folderPath + '/',
//             Delimiter: '/' // Limita la lista a objetos directamente en la carpeta
//         };

//         const res: ListObjectsV2CommandOutput = await s3Client.send(new ListObjectsV2Command(listParams));

//         if (res.Contents && res.Contents.length > 0) {
//             // Filtra los objetos para asegurarse de que solo se devuelvan los archivos y no carpetas
//             const fileDetails: FileDetail[] = await Promise.all(res.Contents
//                 .filter(objeto => !objeto.Key!.endsWith('/')) // Filtra para asegurarse de que no son carpetas
//                 .map(async (objeto) => {
//                     const headRes: HeadObjectCommandOutput = await s3Client.send(new HeadObjectCommand({
//                         Bucket: BUCKET_NAME,
//                         Key: objeto.Key!
//                     }));
//                     return {
//                         Key: objeto.Key!,
//                         LastModified: objeto.LastModified!,
//                         ETag: objeto.ETag!,
//                         Size: objeto.Size!,
//                         StorageClass: objeto.StorageClass!,
//                         Metadata: headRes.Metadata || {}, // Información adicional
//                         Location: `${S3_PATH_FILE}/${objeto.Key}` // Ajusta la URL según tu configuración
//                     };
//                 })
//             );

//             return { files: fileDetails, message: `Archivos listados exitosamente en la carpeta '${folderPath}'.` };
//         } else {
//             return { files: [], message: `No se encontraron archivos en la carpeta '${folderPath}'.` };
//         }
//     } catch (error) {
//         return { files: [], message: `Error al listar los archivos en la carpeta: ${error.message}` };
//     }
// };

// export const listFoldersAndFiles = async (prefix = '') => {
//     try {
//         let isTruncated = true;
//         let ContinuationToken = null;
//         const result = {
//             folders: new Set<string>(),
//             files: []
//         };

//         // Asegurarse de que el prefix tenga '/' al final
//         const formattedPrefix = ensureTrailingSlash(prefix)

//         while (isTruncated) {
//             const { Contents, IsTruncated, NextContinuationToken } = await s3Client.send(new ListObjectsV2Command({
//                 Bucket: BUCKET_NAME,
//                 Prefix: formattedPrefix,
//                 ContinuationToken,
//                 Delimiter: '/'
//             }));

//             Contents?.forEach(objeto => {
//                 const key = objeto.Key;

//                 if (key.endsWith('/')) {
//                     // Es una carpeta
//                     result.folders.add(key);
//                 } else {
//                     // Es un archivo
//                     result.files.push({
//                         key,
//                         size: objeto.Size,
//                         lastModified: objeto.LastModified
//                     });

//                     // Agrega carpetas a la lista de carpetas
//                     const parts = key.split('/');
//                     for (let i = 1; i < parts.length; i++) {
//                         result.folders.add(parts.slice(0, i).join('/') + '/');
//                     }
//                 }
//             });

//             isTruncated = IsTruncated;
//             ContinuationToken = NextContinuationToken;
//         }

//         // Convierte el set de carpetas a un array
//         return {
//             folders: Array.from(result.folders),
//             files: result.files
//         };
//     } catch (error) {
//         return { files: [], message: `Error al listar los archivos en la raíz del bucket: ${error.message}` };
//         // console.error(`Error al listar carpetas y archivos: ${error.message}`);
//     }
// };

// export const listFirstLayerAndSizes = async (prefix = '') => {
//     try {
//         let continuationToken = null;
//         const result = {
//             folders: [],
//             files: [],
//             currentFolderSize: 0,
//             filesCount: 0,
//             foldersCount: 0,
//             sizeFormatted: '0 bytes',
//         };

//         const formattedPrefix = ensureTrailingSlash(prefix);

//         // Listar archivos y carpetas
//         do {
//             const { Contents, IsTruncated, NextContinuationToken, CommonPrefixes } = await s3Client.send(
//                 new ListObjectsV2Command({
//                     Bucket: BUCKET_NAME,
//                     Prefix: formattedPrefix,
//                     Delimiter: '/',
//                     ContinuationToken: continuationToken,
//                 })
//             );

//             // Procesar carpetas
//             CommonPrefixes?.forEach((prefixObj) => {
//                 const folderKey = prefixObj.Prefix;
//                 const folderName = getLastSegment(folderKey);
//                 result.folders.push({
//                     name: folderName,
//                     prefix: folderKey,
//                     size: 0,
//                     sizeFormatted: '0 bytes',
//                     filesCount: 0,
//                     foldersCount: 0,
//                 });
//                 result.foldersCount += 1;
//             });

//             // Procesar archivos en la carpeta actual
//             Contents?.forEach((objeto) => {
//                 const key = objeto.Key;
//                 if (!key.endsWith('/')) {
//                     if (key.startsWith(formattedPrefix) && key.replace(formattedPrefix, '').split('/').length === 1) {
//                         result.files.push({
//                             key,
//                             name: getLastSegment(key),
//                             fileType: getFileType(key),
//                             size: objeto.Size,
//                             sizeFormatted: formatSize(objeto.Size),
//                             lastModified: objeto.LastModified,
//                             location: `${S3_PATH_FILE}/${objeto.Key}`,
//                         });

//                         result.currentFolderSize += objeto.Size;
//                         result.filesCount += 1;
//                     }
//                 }
//             });

//             continuationToken = NextContinuationToken;
//         } while (continuationToken);

//         // Procesar subcarpetas en paralelo
//         await Promise.all(
//             result.folders.map(async (folderData) => {
//                 let folderSize = 0;
//                 let filesCount = 0;
//                 let foldersCount = 0;
//                 let subContinuationToken = null;

//                 do {
//                     const { Contents, IsTruncated, NextContinuationToken, CommonPrefixes } = await s3Client.send(
//                         new ListObjectsV2Command({
//                             Bucket: BUCKET_NAME,
//                             Prefix: folderData.prefix,
//                             Delimiter: '/',
//                             ContinuationToken: subContinuationToken,
//                         })
//                     );

//                     Contents?.forEach((objeto) => {
//                         const key = objeto.Key;
//                         if (!key.endsWith('/')) {
//                             folderSize += objeto.Size;
//                             filesCount += 1;
//                         }
//                     });

//                     CommonPrefixes?.forEach(() => {
//                         foldersCount += 1;
//                     });

//                     subContinuationToken = NextContinuationToken;
//                 } while (subContinuationToken);

//                 folderData.size = folderSize;
//                 folderData.sizeFormatted = formatSize(folderSize);
//                 folderData.filesCount = filesCount;
//                 folderData.foldersCount = foldersCount;
//             })
//         );

//         result.currentFolderSize += result.folders.reduce((total, folder) => total + folder.size, 0);

//         return {
//             success: true,
//             data: {
//                 ...result,
//                 sizeFormatted: formatSize(result.currentFolderSize),
//             },
//         };
//     } catch (error) {
//         return {
//             success: false,
//             message: `Error al listar carpetas y archivos: ${error.message}`,
//         };
//     }
// };


// // Función para listar carpetas y calcular el tamaño total y número de archivos
// export const listFoldersInLayer = async (prefix = '') => {
//     try {
//         let continuationToken = null;
//         const result = {
//             folders: [],
//             foldersCount: 0,
//             filesCount: 0,
//             sizeFormatted: '0 bytes',
//         };

//         const formattedPrefix = ensureTrailingSlash(prefix);

//         // Listar carpetas de la primera capa
//         do {
//             const { CommonPrefixes, IsTruncated, NextContinuationToken } = await s3Client.send(
//                 new ListObjectsV2Command({
//                     Bucket: BUCKET_NAME,
//                     Prefix: formattedPrefix,
//                     Delimiter: '/',
//                     ContinuationToken: continuationToken,
//                 })
//             );

//             const folderPromises = (CommonPrefixes || []).map(async (prefixObj) => {
//                 const folderKey = prefixObj.Prefix;
//                 const folderName = folderKey.split('/').filter(Boolean).pop(); // Obtiene el nombre de la carpeta
//                 const folderData = {
//                     name: folderName,
//                     prefix: folderKey,
//                     size: 0,
//                     filesCount: 0,
//                     foldersCount: 0,
//                     sizeFormatted: '0 bytes',
//                 };

//                 let isFolderTruncated = true;
//                 let folderContinuationToken = null;

//                 // Obtener información de los archivos dentro de la carpeta
//                 while (isFolderTruncated) {
//                     const { Contents, IsTruncated, NextContinuationToken, CommonPrefixes } = await s3Client.send(
//                         new ListObjectsV2Command({
//                             Bucket: BUCKET_NAME,
//                             Prefix: folderKey,
//                             Delimiter: '/',
//                             ContinuationToken: folderContinuationToken,
//                         })
//                     );

//                     (Contents || []).forEach((objeto) => {
//                         if (!objeto.Key.endsWith('/')) {
//                             folderData.size += objeto.Size;
//                             folderData.filesCount += 1;
//                         }
//                     });

//                     (CommonPrefixes || []).forEach(() => {
//                         folderData.foldersCount += 1;
//                     });

//                     isFolderTruncated = IsTruncated;
//                     folderContinuationToken = NextContinuationToken;
//                 }

//                 folderData.sizeFormatted = formatSize(folderData.size);
//                 return folderData;
//             });

//             // Esperar a que se completen todas las promesas para las carpetas
//             const folderResults = await Promise.all(folderPromises);

//             result.folders.push(...folderResults);
//             result.foldersCount += folderResults.length;

//             continuationToken = NextContinuationToken;
//         } while (continuationToken);

//         // Calcular el tamaño total y número de archivos de la carpeta actual
//         result.sizeFormatted = formatSize(
//             result.folders.reduce((total, folder) => total + folder.size, 0)
//         );

//         return {
//             success: true,
//             data: result,
//         };
//     } catch (error) {
//         return {
//             success: false,
//             message: `Error al listar carpetas: ${error.message}`,
//         };
//     }
// };


// export const listFoldersInLayerV4 = async (prefix = '') => {
//     try {
//         let continuationToken = null;
//         const result = {
//             folders: [],
//             foldersCount: 0,
//             filesCount: 0,
//             sizeFormatted: '0 bytes',
//         };

//         const formattedPrefix = ensureTrailingSlash(prefix);

//         do {
//             // Listar carpetas de la primera capa
//             const { CommonPrefixes, IsTruncated, NextContinuationToken, Contents } = await s3Client.send(
//                 new ListObjectsV2Command({
//                     Bucket: BUCKET_NAME,
//                     Prefix: formattedPrefix,
//                     Delimiter: '/',
//                     ContinuationToken: continuationToken,
//                 })
//             );

//             if (CommonPrefixes) {
//                 const folderDataPromises = CommonPrefixes.map(async (prefixObj) => {
//                     const folderKey = prefixObj.Prefix;
//                     const folderName = folderKey.split('/').filter(Boolean).pop(); // Obtiene el nombre de la carpeta
//                     let folderSize = 0;
//                     let filesCount = 0;

//                     let folderContinuationToken = null;
//                     let isFolderTruncated = true;

//                     while (isFolderTruncated) {
//                         // Obtener información de los archivos dentro de la carpeta
//                         const { Contents, IsTruncated, NextContinuationToken } = await s3Client.send(
//                             new ListObjectsV2Command({
//                                 Bucket: BUCKET_NAME,
//                                 Prefix: folderKey,
//                                 Delimiter: '/',
//                                 ContinuationToken: folderContinuationToken,
//                             })
//                         );

//                         (Contents || []).forEach((objeto) => {
//                             if (!objeto.Key.endsWith('/')) {
//                                 folderSize += objeto.Size;
//                                 filesCount += 1;
//                             }
//                         });

//                         isFolderTruncated = IsTruncated;
//                         folderContinuationToken = NextContinuationToken;
//                     }

//                     return {
//                         name: folderName,
//                         prefix: folderKey,
//                         size: folderSize,
//                         filesCount,
//                         foldersCount: (CommonPrefixes || []).length,
//                         sizeFormatted: formatSize(folderSize),
//                     };
//                 });

//                 const folderResults = await Promise.all(folderDataPromises);

//                 result.folders.push(...folderResults);
//                 result.foldersCount += folderResults.length;
//             }

//             continuationToken = NextContinuationToken;
//         } while (continuationToken);

//         result.sizeFormatted = formatSize(
//             result.folders.reduce((total, folder) => total + folder.size, 0)
//         );

//         return {
//             success: true,
//             data: result,
//         };
//     } catch (error) {
//         return {
//             success: false,
//             message: `Error al listar carpetas: ${error.message}`,
//         };
//     }
// };


// // listar carpetas anidados
// export const listFoldersWithNestedStructure = async (prefix = '') => {
//     const listFolders = async (folderPrefix: string) => {
//         const result = {
//             name: folderPrefix.split('/').filter(Boolean).pop() || '',
//             prefix: folderPrefix,
//             subItems: [],
//         };

//         let isTruncate = true;
//         let continuationToken = null;

//         do {
//             const { CommonPrefixes, IsTruncated, NextContinuationToken } = await s3Client.send(
//                 new ListObjectsV2Command({
//                     Bucket: BUCKET_NAME,
//                     Prefix: folderPrefix,
//                     Delimiter: '/',
//                     ContinuationToken: continuationToken,
//                 })
//             );

//             if (CommonPrefixes) {
//                 const nestedFolders = await Promise.all(
//                     CommonPrefixes.map(async (prefixObj) => {
//                         const nestedPrefix = prefixObj.Prefix;
//                         return await listFolders(nestedPrefix);
//                     })
//                 );

//                 result.subItems.push(...nestedFolders);
//             }

//             isTruncate = IsTruncated
//             continuationToken = NextContinuationToken;
//         } while (isTruncate);

//         return result;
//     };

//     try {
//         const formattedPrefix = ensureTrailingSlash(prefix);
//         const folderStructure = await listFolders(formattedPrefix);

//         return {
//             success: true,
//             data: folderStructure,
//         };
//     } catch (error) {
//         return {
//             success: false,
//             message: `Error al listar carpetas: ${error.message}`,
//         };
//     }
// };

// export const listFoldersWithFlatStructure = async (prefix = '') => {
//     const listFolders = async (folderPrefix: string, accumulatedFolders: any[] = []) => {
//         let isTruncate = true;
//         let continuationToken = null;

//         do {
//             const { CommonPrefixes, IsTruncated, NextContinuationToken } = await s3Client.send(
//                 new ListObjectsV2Command({
//                     Bucket: BUCKET_NAME,
//                     Prefix: folderPrefix,
//                     Delimiter: '/',
//                     ContinuationToken: continuationToken,
//                 })
//             );

//             if (CommonPrefixes) {
//                 for (const prefixObj of CommonPrefixes) {
//                     const nestedPrefix = prefixObj.Prefix;
//                     const folderName = nestedPrefix.split('/').filter(Boolean).pop() || '';
                    
//                     // Agrega la carpeta a la lista plana
//                     accumulatedFolders.push({
//                         name: folderName,
//                         prefix: nestedPrefix,
//                     });

//                     // Llama recursivamente para listar carpetas anidadas
//                     await listFolders(nestedPrefix, accumulatedFolders);
//                 }
//             }

//             isTruncate = IsTruncated;
//             continuationToken = NextContinuationToken;
//         } while (isTruncate);

//         return accumulatedFolders;
//     };

//     try {
//         const formattedPrefix = ensureTrailingSlash(prefix);
//         const flatFolderStructure = await listFolders(formattedPrefix);

//         return {
//             success: true,
//             data: flatFolderStructure,
//         };
//     } catch (error) {
//         return {
//             success: false,
//             message: `Error al listar carpetas: ${error.message}`,
//         };
//     }
// };


// export const listFoldersWithNestedStructurePaginated = async (prefix = '', limit = 50, continuationToken = null) => {
//     const listFolders = async (folderPrefix: string, limit: number, continuationToken: string | null) => {
//         const result = {
//             name: folderPrefix.split('/').filter(Boolean).pop() || '',
//             prefix: folderPrefix,
//             folders: [],
//             nextToken: null,  // To store the continuation token for pagination
//         };

//         const { CommonPrefixes, IsTruncated, NextContinuationToken } = await s3Client.send(
//             new ListObjectsV2Command({
//                 Bucket: BUCKET_NAME,
//                 Prefix: folderPrefix,
//                 Delimiter: '/',
//                 MaxKeys: limit,  // Limit the number of results returned
//                 ContinuationToken: continuationToken,
//             })
//         );

//         if (CommonPrefixes) {
//             const nestedFolders = await Promise.all(
//                 CommonPrefixes.map(async (prefixObj) => {
//                     const nestedPrefix = prefixObj.Prefix;
//                     return await listFolders(nestedPrefix, limit, null);  // Nested folders can be fetched without pagination for now
//                 })
//             );

//             result.folders.push(...nestedFolders);
//         }

//         result.nextToken = IsTruncated ? NextContinuationToken : null;

//         return result;
//     };

//     try {
//         const formattedPrefix = ensureTrailingSlash(prefix);
//         const folderStructure = await listFolders(formattedPrefix, limit, continuationToken);

//         return {
//             success: true,
//             data: folderStructure,
//         };
//     } catch (error) {
//         return {
//             success: false,
//             message: `Error al listar carpetas: ${error.message}`,
//         };
//     }
// };



// // Listar solo archivos en la primera capa
// export const listFilesInLayer = async (prefix = '') => {
//     try {
//         let isTruncated = true;
//         let ContinuationToken = null;
//         const result = {
//             files: [],
//             size: 0,
//             currentFolderSize: 0,
//             filesCount: 0,
//         };

//         const formattedPrefix = ensureTrailingSlash(prefix);

//         while (isTruncated) {
//             const { Contents, IsTruncated, NextContinuationToken } = await s3Client.send(new ListObjectsV2Command({
//                 Bucket: BUCKET_NAME,
//                 Prefix: formattedPrefix,
//                 Delimiter: '/' // Usado para obtener solo la primera capa de archivos
//             }));

//             // Procesar archivos en la carpeta actual
//             Contents?.forEach(objeto => {
//                 const key = objeto.Key;

//                 if (!key.endsWith('/')) {
//                     // Es un archivo en la carpeta actual
//                     if (key.startsWith(formattedPrefix) && key.replace(formattedPrefix, '').split('/').length === 1) {
//                         result.files.push({
//                             key,
//                             name: getLastSegment(key),
//                             fileTye: getFileType(key),
//                             size: objeto.Size,
//                             sizeFormatted: formatSize(objeto.Size),
//                             lastModified: objeto.LastModified
//                         });

//                         // Sumar el tamaño del archivo a la carpeta actual
//                         result.currentFolderSize += objeto.Size;
//                         result.filesCount += 1;
//                     }
//                 }
//             });

//             isTruncated = IsTruncated;
//             ContinuationToken = NextContinuationToken;
//         }

//         return {
//             success: true,
//             data: {
//                 ...result,
//                 size: result.currentFolderSize, // Tamaño formateado
//                 currentFolderSize: formatSize(result.currentFolderSize), // Tamaño formateado
//                 filesCount: result.filesCount
//             }
//         };
//     } catch (error) {
//         return {
//             success: false,
//             message: `Error al listar archivos: ${error.message}`
//         };
//     }
// };




// // CALCULAR EL PESO TOTAL USADO EN EL BUCKET Y POR TIPO DE ARCHIVOS (Audio, Imagen, Docuemntos, etc..)
// export const calculateBucketSize = async () => {
//     let totalSize = 0;
//     let continuationToken;
//     let totalFiles = 0;
//     let totalFolders = 0;
//     const folders = [];
//     const sizeByType = {
//         audio: { size: 0, sizeFormatted: '0 bytes', totalFiles: 0 },
//         video: { size: 0, sizeFormatted: '0 bytes', totalFiles: 0 },
//         image: { size: 0, sizeFormatted: '0 bytes', totalFiles: 0 },
//         document: { size: 0, sizeFormatted: '0 bytes', totalFiles: 0 },
//         other: { size: 0, sizeFormatted: '0 bytes', totalFiles: 0 },
//     };

//     try {
//         do {
//             const listParams = {
//                 Bucket: BUCKET_NAME,
//                 ContinuationToken: continuationToken,
//             };

//             const data = await s3Client.send(new ListObjectsV2Command(listParams));
//             const objects = data.Contents || [];

//             for (const object of objects) {
//                 if (object.Size !== undefined && !object.Key.endsWith('/')) {
//                     // Contabilizar solo archivos, no carpetas
//                     totalSize += object.Size;
//                     totalFiles += 1;

//                     // Determinar el tipo de archivo y actualizar el tamaño y cantidad por tipo
//                     const fileType = getFileType(object.Key);
//                     if (sizeByType[fileType]) {
//                         sizeByType[fileType].size += object.Size;
//                         sizeByType[fileType].totalFiles += 1;
//                         sizeByType[fileType].sizeFormatted = formatSize(sizeByType[fileType].size);
//                     }
//                 } else if (object.Key.endsWith('/')) {
//                     // Si el objeto representa una carpeta, añadir a objectsDetails
//                     totalFolders += 1;
//                     folders.push({
//                         key: object.Key,
//                         size: object.Size,
//                         lastModified: object.LastModified,
//                     });
//                 }
//             }

//             continuationToken = data.NextContinuationToken;

//         } while (continuationToken);

//         // Estructura de respuesta
//         const response = {
//             bucketName: BUCKET_NAME,
//             totalSize,
//             sizeFormatted: formatSize(totalSize),
//             totalFiles,
//             totalFolders,
//             folders,
//             sizeByType,
//         };

//         return { success: true, data: response };

//     } catch (error) {
//         return { success: false, message: `Error al calcular el tamaño total del bucket: ${error.message}` };
//     }
// };


// /**
//  * *******************************************************************************
//  * PARA ARCHIVOS
//  * *******************************************************************************
//  */
// export const renameFileV1 = async (carpetaOriginal: string, nuevaCarpeta: string) => {
//     const listarObjetosParams = {
//         Bucket: BUCKET_NAME,
//         Prefix: carpetaOriginal, // Obtener todos los objetos que empiezan con el nombre de la carpeta original
//     };

//     try {
//         const data = await s3Client.send(new ListObjectsV2Command(listarObjetosParams));
//         const objetos = data.Contents;

//         if (!objetos || objetos.length === 0) {
//             const crearCarpetaParams = {
//                 Bucket: BUCKET_NAME,
//                 Key: `${nuevaCarpeta}/`
//             };

//             await s3Client.send(new PutObjectCommand(crearCarpetaParams));

//             // Eliminar la carpeta original si es necesario
//             if (carpetaOriginal !== nuevaCarpeta) {
//                 await s3Client.send(new DeleteObjectsCommand({
//                     Bucket: BUCKET_NAME,
//                     Delete: {
//                         Objects: [{ Key: `${carpetaOriginal}/` }]
//                     }
//                 }));
//             }

//             return;
//         }

//         // Copiar objetos a la nueva carpeta
//         const operacionesCopia = objetos.map((objeto) => {
//             const nuevoNombre = objeto.Key.replace(carpetaOriginal, nuevaCarpeta);
//             const copiarParams = {
//                 Bucket: BUCKET_NAME,
//                 CopySource: `${BUCKET_NAME}/${objeto.Key}`,
//                 Key: nuevoNombre,
//             };
//             return s3Client.send(new CopyObjectCommand(copiarParams));
//         });

//         await Promise.all(operacionesCopia);

//         // Eliminar objetos en la carpeta original
//         const operacionesEliminar = {
//             Bucket: BUCKET_NAME,
//             Delete: {
//                 Objects: objetos.map((objeto) => ({ Key: objeto.Key })),
//             },
//         };

//         await s3Client.send(new DeleteObjectsCommand(operacionesEliminar));
//         return { success: true, message: `Carpeta '${carpetaOriginal}' renombrada a '${nuevaCarpeta}'.` }
//     } catch (error) {
//         return { success: false, message: `Error al renombrar la carpeta: ${error.message}.` }
//     }
// };

// export const renameFile = async (oldKey: string, newKey: string): Promise<{ success: boolean; message: string }> => {
//     try {
//         // Copiar el objeto al nuevo nombre
//         const copyParams = {
//             Bucket: BUCKET_NAME,
//             CopySource: `${BUCKET_NAME}/${oldKey}`,
//             Key: newKey,
//             ACL: ObjectCannedACL.public_read_write,
//         };
//         await s3Client.send(new CopyObjectCommand(copyParams));

//         // Eliminar el objeto viejo
//         const deleteParams = {
//             Bucket: BUCKET_NAME,
//             Key: oldKey,
//         };
//         await s3Client.send(new DeleteObjectCommand(deleteParams));

//         return { success: true, message: `Archivo '${oldKey}' renombrado a '${newKey}'.` };
//     } catch (error) {
//         return { success: false, message: `Error al renombrar el archivo: ${error.message}.` };
//     }
// }

// export const moveFile = async (sourceKey: string, destinationKey: string): Promise<MoveObjectResult> => {
//     try {
//         // Copiar el archivo al nuevo directorio
//         const copyParams = {
//             Bucket: BUCKET_NAME,
//             CopySource: `${BUCKET_NAME}/${sourceKey}`,
//             Key: destinationKey,
//         };

//         const copyResponse: CopyObjectCommandOutput = await s3Client.send(new CopyObjectCommand(copyParams));

//         if (copyResponse.CopyObjectResult) {
//             // Eliminar el archivo del directorio original
//             const deleteParams = {
//                 Bucket: BUCKET_NAME,
//                 Key: sourceKey,
//             };

//             const deleteResponse: DeleteObjectCommandOutput = await s3Client.send(new DeleteObjectCommand(deleteParams));

//             if (deleteResponse.$metadata.httpStatusCode === 204) {
//                 return { success: true, message: `El archivo fue movido de '${sourceKey}' a '${destinationKey}' con éxito.` };
//             } else {
//                 return { success: false, message: `El archivo fue copiado pero no se pudo eliminar el archivo original.` };
//             }
//         } else {
//             return { success: false, message: `No se pudo copiar el archivo de '${sourceKey}' a '${destinationKey}'.` };
//         }
//     } catch (error) {
//         return { success: false, message: `Error al mover el archivo: ${error.message}` };
//     }
// };

// export const copyFile = async (sourceKey: string, destinationKey: string): Promise<MoveObjectResult> => {
//     try {
//         // Parámetros para copiar el archivo
//         const copyParams = {
//             Bucket: BUCKET_NAME,
//             CopySource: `${BUCKET_NAME}/${sourceKey}`,
//             Key: destinationKey,
//         };

//         // Ejecutar el comando de copia
//         const copyResponse: CopyObjectCommandOutput = await s3Client.send(new CopyObjectCommand(copyParams));

//         // Verificar si la operación de copia fue exitosa
//         if (copyResponse.CopyObjectResult) {
//             return { success: true, message: `El archivo fue copiado de '${sourceKey}' a '${destinationKey}' con éxito.` };
//         } else {
//             return { success: false, message: `No se pudo copiar el archivo de '${sourceKey}' a '${destinationKey}'.` };
//         }
//     } catch (error) {
//         return { success: false, message: `Error al copiar el archivo: ${error.message}` };
//     }
// };


// // SHARE
// export const shareLink = async (key: string, isFolder: boolean, expiresInSeconds: number = 3600): Promise<ShareObjectResult> => {
//     try {
//         if (isFolder) {
//             // Listar objetos en la carpeta
//             const listParams = {
//                 Bucket: BUCKET_NAME,
//                 Prefix: key.endsWith('/') ? key : `${key}/`,
//                 ACL: ObjectCannedACL.public_read_write,
//             };

//             const listResponse: ListObjectsV2CommandOutput = await s3Client.send(new ListObjectsV2Command(listParams));

//             if (!listResponse.Contents || listResponse.Contents.length === 0) {
//                 return { success: false, message: `La carpeta '${key}' está vacía o no existe.` };
//             }

//             // Generar URLs firmadas para cada objeto en la carpeta
//             const urls = await Promise.all(
//                 listResponse.Contents.map(async (item) => {
//                     const getObjectParams: GetObjectCommandInput = {
//                         Bucket: BUCKET_NAME,
//                         Key: item.Key!,
//                     };
//                     const url = await getSignedUrl(s3Client, new GetObjectCommand(getObjectParams), { expiresIn: expiresInSeconds });
//                     return url;
//                 })
//             );

//             return { success: true, message: `Se generaron enlaces para los archivos en la carpeta '${key}'.`, urls };
//         } else {
//             // Generar un URL firmado para un solo archivo
//             const getObjectParams: GetObjectCommandInput = {
//                 Bucket: BUCKET_NAME,
//                 Key: key,
//             };

//             const url = await getSignedUrl(s3Client, new GetObjectCommand(getObjectParams), { expiresIn: expiresInSeconds });

//             return { success: true, message: `Se generó un enlace para el archivo '${key}'.`, urls: [url] };
//         }
//     } catch (error) {
//         return { success: false, message: `Error al generar el enlace: ${error.message}` };
//     }
// };

// export const generateShareableLink = async (key: string, isFolder: boolean): Promise<string> => {
//     // Aquí generas un link hacia tu propio servidor
//     const baseUrl = S3_PATH_FILE; // Cambia esto por la URL de tu servidor

//     // Parámetro a enviar al backend (puedes codificar la información que necesites)
//     const params = new URLSearchParams({ key, isFolder: isFolder.toString() }).toString();

//     return `${baseUrl}?${params}`;
// };

// // LIST BUCKETS
// export const listS3Buckets = async () => {
//     try {
//         const data = await s3Client.send(new ListBucketsCommand({}));
//         return data;
//     } catch (err) {
//         throw err; // Puedes manejar el error según tus necesidades
//     }
// }