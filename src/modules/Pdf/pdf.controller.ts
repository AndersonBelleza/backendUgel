import { Body, Controller, Get, Post, Req, Res, UseInterceptors } from '@nestjs/common';
import { Response } from 'express';
import { lastValueFrom, map, zip } from 'rxjs';
import { HttpService } from '@nestjs/axios'
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import mongoose from 'mongoose';
import { TakService } from '../Tak/tak.service';
import * as archiver from 'archiver'

@Controller('pdf')
export class PdfController {
  constructor( 
    private httpService: HttpService,
    private takService : TakService
   ) {}

  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'files', maxCount: 10 },
  ], {
      fileFilter: (req, file, callback) => {
          // Obtener la extensión del archivo
          const ext = extname(file.originalname);

          // Lista de extensiones permitidas
          const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf', '.xlsx'];

          // Verificar si la extensión está en la lista de extensiones permitidas
          if (allowedExtensions.includes(ext.toLowerCase())) {
              // El archivo es permitido
              callback(null, true);
          } else {
              // El archivo no es permitido
              callback(new Error('Tipo de archivo no permitido'), false);
          }
      },
      storage: diskStorage({
          //destination: 'src/assets/files/solicitud/observaciones', // Ruta donde se guardará la imagen del logo
          destination: (req, file, callback) => {
              callback(null, 'src/assets/files/solicitud/observaciones');
          },
          filename: (req, file, callback) => {
              callback(null, `nombre1${extname(file.originalname)}`);
          },
      }),
  })
  )
  @Post('generatePdfInterest')
  async generatePdfInterest(@Body() body:any, @Res() res: Response, @Req() req: Request) : Promise<void> {  

    const data = { 
        operation: 'InterestReport', 
        content: body,
    };
    
    const pdfResponse = await lastValueFrom(
        this.httpService
            .post('http://localhost/generate/request.php', data, {
                responseType: 'arraybuffer',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            .pipe(
                map((response) => {
                    return response.data;
                }),
            ),
    );
  
  
    const pdfBuffer = Buffer.from(pdfResponse, 'binary');
  
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="documento.pdf"');
    res.status(200).send(pdfBuffer);
  }

  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'files', maxCount: 10 },
  ], {
      fileFilter: (req, file, callback) => {
          // Obtener la extensión del archivo
          const ext = extname(file.originalname);

          // Lista de extensiones permitidas
          const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf', '.xlsx'];

          // Verificar si la extensión está en la lista de extensiones permitidas
          if (allowedExtensions.includes(ext.toLowerCase())) {
              // El archivo es permitido
              callback(null, true);
          } else {
              // El archivo no es permitido
              callback(new Error('Tipo de archivo no permitido'), false);
          }
      },
      storage: diskStorage({
          //destination: 'src/assets/files/solicitud/observaciones', // Ruta donde se guardará la imagen del logo
          destination: (req, file, callback) => {
              callback(null, 'src/assets/files/solicitud/observaciones');
          },
          filename: (req, file, callback) => {
              callback(null, `nombre1${extname(file.originalname)}`);
          },
      }),
  })
  )
  @Post('generatePdfTak')
  async generatePdfTak(@Body() body:any, @Res() res: Response, @Req() req: Request) : Promise<void> {  
    
    const payload = JSON.parse(body['data']);

    let newData : any = {};
      
    const { idArea, idTeamwork, idSubteamwork, dateInit, dateEnd, idStatusPriority, idStatusType } = payload;

    if (dateInit && dateEnd) {
        newData.dateAtenttion = {
            $gte: new Date(dateInit).toISOString(),
            $lte: new Date(dateEnd).toISOString()
        };
    } else if (dateInit) {
        newData.dateAtenttion = {
            $gte: new Date(dateInit).toISOString()
        };
    } else if (dateEnd) {
        newData.dateAtenttion = {
            $lte: new Date(dateEnd).toISOString()
        };
    }

    if( idStatusPriority )  {
    if(idStatusPriority != 'TODOS') newData.idStatusPriority = new mongoose.Types.ObjectId(idStatusPriority);
    }

    if( idStatusType ) {
    if( idStatusType != 'TODOS' ) newData.idStatusType = new mongoose.Types.ObjectId(idStatusType);
    }
    
    // Validar y asignar los filtros
    if (idArea && idArea !== 'TODOS') {
        newData.idArea = new mongoose.Types.ObjectId(idArea);   
    }

    if (idTeamwork && idTeamwork !== 'TODOS') {
        newData.idTeamwork = new mongoose.Types.ObjectId(idTeamwork);
    }

    if (idSubteamwork && idSubteamwork !== 'TODOS') {
        newData.idSubteamwork = new mongoose.Types.ObjectId(idSubteamwork);
    }

    const response = await this.takService.findAll(newData);
    
    var quantity = 200;
    var array: any = [];
    const zipeado = archiver('zip');

    // Separamos los en arrays de 100 objetos
    for (var i = 0; i < response.length; i += quantity) {
        var subarray = response.slice(i, i + quantity);
        array.push(subarray);
    }

    var returnPdfs: any[] = [];
    for (let index = 0; index < array.length; index++) {
        const data = { 
            operation: 'TakReport', 
            content: JSON.stringify(array[index])
        };

        const pdfResponse = await lastValueFrom(
            this.httpService
                .post('http://localhost/generate/request.php', data, {
                    responseType: 'arraybuffer',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                .pipe(
                    map((response) => {
                        return response.data;
                    }),
                ),
        );

        returnPdfs.push(pdfResponse);
    }

    res.setHeader('Content-type', 'application/zip');
    res.attachment(`ReporteTAK.zip`);
    returnPdfs.forEach((pdfRes: any, index: any) => {
      zipeado.append(pdfRes, {
        name: `reporte-${index + 1}.pdf`,
      });
    });

    zipeado.pipe(res);
    zipeado.finalize();

    return 

  }
  
}
