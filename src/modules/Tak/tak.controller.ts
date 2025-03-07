import { Controller, Get, Post, Body, Param, Delete, HttpCode, NotFoundException, Req, Put, ConflictException, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { TakService } from './tak.service';
import { WebSocketGateway } from './tak.gateway';
import { StatusTypeService } from '../statusType/statusType.service';
import { convertDate, generateCodeIssue } from 'src/libs';
import mongoose from 'mongoose';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { diskStorage } from 'multer';

@Controller('tak')
export class TakController {
  constructor(
    private service: TakService, 
    private gateway: WebSocketGateway,
    private statusService: StatusTypeService
  ){}

  @Get()
  buscar(@Req() req: Request){
    return this.service.list();
    
  }

  @Post()
  async create(@Body() body: any, @Req() req: Request){
    try {
      const responseStatusType = await this.statusService.findOne({ type: 'Default', name : 'Pendiente' });
      if( responseStatusType ) body.idStatusType = responseStatusType?._id;

      // ! Asignar codigo por defecto
      const code = generateCodeIssue();

      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));
      const correlative = await this.service.countTak({
        createdAt: {
          $gte: startOfDay.toISOString(),
          $lt: endOfDay.toISOString()
        }
      });

      body.code = code;
      body.correlative = correlative + 1;

      const TabuscarTak = await this.service.createTak(body);

      this.gateway.emitEvent('takAdded', await this.service.listAsync({}));
      return TabuscarTak
    } catch (error) {
      if(error.code === 11000){
        throw new ConflictException('The element already exists');
      }
      throw error;
    }
  }

  @Post('listAsync')
  async listAsyncTak(@Body() body: any, @Req() req: Request){
    try {
      let skip = 0;
      const { page, limit, code, correlative, idArea, idStatusPriority } = body;

      let newData : any = {};

      if( code ) newData.code = code;
      if( correlative ) newData.correlative = correlative;
      if( idArea ) newData['idUser.idArea'] = idArea; // Aún no funciona porque el idArea está dentro de User 
      if( idStatusPriority ) newData.idStatusPriority = idStatusPriority
      if(page && limit) skip = page * limit
      return await this.service.listAsync( newData , skip, limit );

    } catch (error) {
      throw error;
    }
  }

  @Post('listByUser')
  async listTakUserAsync(@Body('idUser') idUser: string, @Body() body: any = {}, @Req() req: Request){
    try {
      let skip = 0;
      const { page, limit } = body;
      if(page && limit) skip = page * limit
      return this.service.listByUserAsync({}, skip, limit); // ´Pasar nueva data del body.

    } catch (error) {
      throw error;
    }

    try {
      if (!idUser) {
        throw new Error('El campo idUser es obligatorio');
      }
      const response = await this.service.listByUserAsync(body);
      return response;
    } catch (error) {
      throw error;
    }
  }

  @Post('update/')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'files', maxCount: 100 },
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
        destination: (req, file, callback) => {
          // Define la ruta de destino en función del tipo de archivo
          var destinationPath = "";
          if (file.fieldname === 'files') {
            destinationPath = 'src/assets/files/tak/';
          }
          callback(null, destinationPath);
        },
        filename: (req, file, callback) => {
          const randomName = randomUUID();
          callback(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async update(@UploadedFiles() files: { files?: any[] }, @Body() body: any, @Req() req: Request) {
    try {
      var data: any = {};
      for (const prop in body) {
        if (typeof body[prop] === "string" && body[prop].trim() !== "" && body[prop] !== 'undefined') {
          data[prop] = JSON.parse(body[prop]);
        } else {
          data[prop] = body[prop];
        }
      }
      
      const id = JSON.parse(body.id);

      if (files?.files?.length > 0) {
        let evidence : any[] = files?.files?.map((img) => {
          return {
            name: img.filename,
            type: img.mimetype,
            url: img.path,
          }
        });
        data.evidence = evidence;
      } 

      const updatedTak = await this.service.updateTak(id, data);
      if (!updatedTak) throw new NotFoundException('Item not found!');

      const fullTak = await this.service.findById(id);
      if (!fullTak) throw new NotFoundException('Item not found after update!');
      this.gateway.emitEvent('takUpdated', fullTak);
      return fullTak;

    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(204)
  async eliminar(@Param('id') id:string, @Req() req: Request): Promise<void>{
    const res = await this.service.deleteTak(id);
    if (!res) {
      throw new NotFoundException(`El elemento con id ${id} no fue encontrado o ya estaba eliminado.`);
    }
    // this.gateway.emitEvent('takDeleted', { id });
  }
}
