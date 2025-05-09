import { Controller, Get, Post, Body, Param, Delete, HttpCode, NotFoundException, Req, Put, ConflictException, UseInterceptors, UploadedFiles, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { TakService } from './tak.service';
import { WebSocketGateway } from './tak.gateway';
import { StatusTypeService } from '../statusType/statusType.service';
import { convertDate, generateCodeIssue } from 'src/libs';
import mongoose from 'mongoose';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { diskStorage } from 'multer';
import { TeamworkService } from '../Teamwork/teamwork.service';

@Controller('tak')
export class TakController {
  constructor(
    private service: TakService, 
    private teamworkservice : TeamworkService,
    private gateway: WebSocketGateway,
    private statusService: StatusTypeService
  ){}

  @Get()
  buscar(@Req() req: Request){
    return this.service.list();
  }
  
  @Get('resume/:idUser')
  async getResume(@Param('idUser') idUser: any) {
    // Verifica si el idUser es válido antes de intentar convertirlo a ObjectId
    if (!mongoose.Types.ObjectId.isValid(idUser)) {
      throw new BadRequestException('El ID de usuario proporcionado no es válido');
    }
    try {
      // Convierte el idUser en un ObjectId
      idUser = new mongoose.Types.ObjectId(idUser);
  
      // Llama al servicio para obtener el "resume"
      const resume = await this.service.getResume(idUser);
      return resume;
    } catch (error) {
      console.error('Error al obtener el resume:', error);
      throw new InternalServerErrorException('Hubo un problema al obtener el resume');
    }
  }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'files', maxCount: 100 },
      { name: 'filesUser', maxCount: 100 },
    ], {
      fileFilter: (req, file, callback) => {
        // Obtener la extensión del archivo
        const ext = extname(file.originalname);
 
        // Lista de extensiones permitidas
        const allowedExtensions = ['.jpg', '.jpeg', '.png'];

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

          if (file.fieldname === 'filesUser') {
            destinationPath = 'src/assets/files/takUser/';
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
  async create(@UploadedFiles() files: { files?: any[] , filesUser?: any[] }, @Body() body: any, @Req() req: Request){
    try {

      var data: any = {};

      for (const prop in body) {
        if (typeof body[prop] === "string" && body[prop].trim() !== "" && body[prop] !== 'undefined') {
          data[prop] = JSON.parse(body[prop]);
        } else {
          data[prop] = body[prop];
        }
      }

      const responseStatusType = await this.statusService.findOne({ type: 'Tak', name : 'Pendiente' });
      if( responseStatusType ) data.idStatusType = new mongoose.Types.ObjectId(responseStatusType?._id);
        
      const { idUser, idStatusPriority, idArea, idTeamwork, idSubteamwork, idTechnical } = data;

      if (files?.filesUser?.length > 0) {
        let evidence : any[] = files?.filesUser?.map((img) => {
          return {
            name: img.filename,
            type: img.mimetype,
            url: img.path,
          }
        });
        data.evidenceUser = evidence
      } 

      // ! Asignar codigo por defecto
      // const code = generateCodeIssue();
      const code = new Date().getFullYear();

      const correlative = await this.service.countTak();

      data.qualification = 0;
      data.code = code;
      data.correlative = correlative + 1;
      if( idUser ) data.idUser = new mongoose.Types.ObjectId(idUser);
      if( idArea ) data.idArea = new mongoose.Types.ObjectId(idArea);
      if( idTeamwork ) data.idTeamwork = new mongoose.Types.ObjectId(idTeamwork);
      if( idSubteamwork ) data.idSubteamwork = new mongoose.Types.ObjectId(idSubteamwork);
      if( idTechnical ) data.idTechnical = new mongoose.Types.ObjectId(idTechnical);

      if( idStatusPriority ) data.idStatusPriority = new mongoose.Types.ObjectId(idStatusPriority);

      const TabuscarTak = await this.service.createTak(data);

      this.gateway.emitEvent('takAdded', await this.listAsyncTak({}));
      return TabuscarTak
      
    } catch (error) {
      if(error.code === 11000){
        throw new ConflictException('The element already exists');
      }
      throw error;
    }
  }

  @Post('listReport')
  async listReport(@Body() body:any, @Req() req: Request) {  
        
      let newData : any = {};
        
      const { idArea, idTeamwork, idSubteamwork, dateInit, dateEnd, idStatusPriority, idStatusType } = body;
  
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
  
      const response = await this.service.findAll(newData);

      return response;
  }

  @Post('listAsync')
  async listAsyncTak(@Body() body: any, @Req() req?: Request){
    try {
      let skip = 0;
      const { page, limit, code, correlative, idStatusType, idStatusPriority, idUser, idArea, idTeamwork, idSubteamwork } = body;

      let newData : any = {};

      if( code ) newData.code = code;
      if( correlative ) newData.correlative = correlative;
      
      if( idArea ) newData.idArea = new mongoose.Types.ObjectId(idArea);
      if( idTeamwork ) newData.idTeamwork = new mongoose.Types.ObjectId(idTeamwork);
      if( idSubteamwork ) newData.idSubteamwork = new mongoose.Types.ObjectId(idSubteamwork);
      if( idUser ) newData.idUser = new mongoose.Types.ObjectId(idUser);

      if( idStatusPriority )  {
        if(idStatusPriority != 'TODOS') newData.idStatusPriority = new mongoose.Types.ObjectId(idStatusPriority);
      }

      if( idStatusType ) {
        if( idStatusType != 'TODOS' ) newData.idStatusType = new mongoose.Types.ObjectId(idStatusType);
      }else {
        const responseDefault = await this.statusService.findAll({ type: 'Tak' });

        const statusIds = responseDefault
          .filter((item: any) => item?.name === 'En proceso' || item?.name === 'Pendiente') // Filtra los dos estados
          .map((item: any) => new mongoose.Types.ObjectId(item?._id)); // Mapea solo los _id
      
        if (statusIds.length > 0) {
          newData.idStatusType = { $in: statusIds };
        }
      }

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
      { name: 'filesUser', maxCount: 100 },
    ], {
      fileFilter: (req, file, callback) => {
        // Obtener la extensión del archivo
        const ext = extname(file.originalname);
 
        // Lista de extensiones permitidas
        const allowedExtensions = ['.jpg', '.jpeg', '.png'];

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

          if (file.fieldname === 'filesUser') {
            destinationPath = 'src/assets/files/takUser/';
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
  async update(@UploadedFiles() files: { files?: any[], filesUser?: any[],  }, @Body() body: any, @Req() req: Request) {
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

      // Buscamos el TAK.
      const fullTak = await this.service.findById(id);
      if (!fullTak) throw new NotFoundException('Item not found after update!');
      
      if (files?.files?.length > 0) {
        let evidence : any[] = files?.files?.map((img) => {
          return {
            name: img.filename,
            type: img.mimetype,
            url: img.path,
          }
        });
        data.evidence = [ ...fullTak.evidence, ...evidence ];
      } 

      if (files?.filesUser?.length > 0) {
        let evidence : any[] = files?.filesUser?.map((img) => {
          return {
            name: img.filename,
            type: img.mimetype,
            url: img.path,
          }
        });
        data.evidence = [ ...fullTak.evidenceUser, ...evidence ];
      } 
      
      const { idStatusPriority, idStatusType,  idTimePeriod, idTechnical, idArea, idTeamwork, idSubteamwork, dateAttention, } = data; // TODO: Estos datos aparecen de "data"
      if( idStatusPriority ) data.idStatusPriority = new mongoose.Types.ObjectId(idStatusPriority);
      if( idStatusType ) data.idStatusType = new mongoose.Types.ObjectId(idStatusType);
      if( idTimePeriod ) data.idTimePeriod = new mongoose.Types.ObjectId(idTimePeriod);
      if( idTechnical ) data.idTechnical = new mongoose.Types.ObjectId(idTechnical);
      if( idArea ) data.idArea = new mongoose.Types.ObjectId(idArea);
      if( idTeamwork ) data.idTeamwork = new mongoose.Types.ObjectId(idTeamwork);
      if( idSubteamwork ) data.idSubteamwork = new mongoose.Types.ObjectId(idSubteamwork);
      if( dateAttention ) data.dateAttention = dateAttention;

      // * SE DEBE VALIDAR QUE TODOS LOS ID, SE GUARDEN COMO "OBJECTID"
      const updatedTak = await this.service.updateTak(id, data);
      if (!updatedTak) throw new NotFoundException('Item not found!');

      this.gateway.emitEvent('takUpdate', await this.listAsyncTak({}));
      return fullTak;

    } catch (error) {
      throw error;
    }
  }

  @Put('updateAssingTechnical/:id')
  async updateAssingTechnical(@Param('id')  id : string, @Body() body: any, @Req() req: Request) {
    try { 
      const { idTechnical } = body;

      let data : any = {};

      // * SE DEBE VALIDAR QUE TODOS LOS ID, SE GUARDEN COMO "OBJECTID"
      if( idTechnical ) data.idTechnical = new mongoose.Types.ObjectId(idTechnical);
      const responseStatusType = await this.statusService.findOne({ type: 'Tak', name : 'En proceso' });
      if( responseStatusType ) data.idStatusType = new mongoose.Types.ObjectId(responseStatusType?._id);

      const updatedTak = await this.service.updateTak(id, data);
      if (!updatedTak) throw new NotFoundException('Item not found!');

      this.gateway.emitEvent('takUpdate', await this.listAsyncTak({}));
      return updatedTak;

    } catch (error) {
      throw error;
    }
  }

  @Put('cancelTak/:id')
  async cancelTak(@Param('id')  id : string, @Body() body: any, @Req() req: Request) {
    try { 
      // const { idTechnical } = body;
      let data : any = {};
      // * SE DEBE VALIDAR QUE TODOS LOS ID, SE GUARDEN COMO "OBJECTID"
      // if( idTechnical ) data.idTechnical = new mongoose.Types.ObjectId(idTechnical);
      const responseStatusType = await this.statusService.findOne({ type: 'Tak', name : 'Cancelado' });
      if( responseStatusType ) data.idStatusType = new mongoose.Types.ObjectId(responseStatusType?._id);
      const updatedTak = await this.service.updateTak(id, data);
      if (!updatedTak) throw new NotFoundException('Item not found!');
      this.gateway.emitEvent('takUpdate', await this.listAsyncTak({}));
      return updatedTak;
    } catch (error) {
      throw error;
    }
  }

  @Put('qualify/:id')
  async qualify(@Param('id')  id : string, @Body() body: any, @Req() req: Request) {
    try { 
      let data: any = {};
      const { qualification } = body;
      // Validación de calificación (debe ser un número entre 1 y 5)
      if (typeof qualification !== 'number' || qualification < 1 || qualification > 5) {
        throw new BadRequestException('La calificación debe estar entre 1 y 5');
      }
      // Obtener el estado "Calificado"
      const responseStatusType = await this.statusService.findOne({ type: 'Tak', name: 'Completado' });
      if (responseStatusType) {
        data.idStatusType = new mongoose.Types.ObjectId(responseStatusType._id);
      }
      // Agregar la calificación a los datos que se actualizarán
      data.qualification = qualification;
      // Actualizar el ítem con la calificación
      const updatedTak = await this.service.updateTak(id, data);
      if (!updatedTak) throw new NotFoundException('Ítem no encontrado');
      // Emitir evento WebSocket para notificar la actualización
      this.gateway.emitEvent('takUpdate', await this.listAsyncTak({}));
      return updatedTak;
    } catch (error) {
      throw error;
    }
  }

  // Reportes
  @Post('reportsCountTaks')
  async reportsCountTaks (@Body() body: any, @Req() req?: Request ){
    try {

      let newData : any = {};
      
      const { idArea, idTeamwork, idSubteamwork, dateInit, dateEnd, idStatusPriority, idStatusType } = body;
    
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
      
      // Clonar newData para evitar referencias compartidas
      let areaFilter = { ...newData };
      let teamworkFilter = { ...newData };
      let subteamworkFilter = { ...newData };

      // Validar y asignar los filtros
      if (idArea && idArea !== 'TODOS') {
        const areaObjectId = new mongoose.Types.ObjectId(idArea);
        areaFilter.idArea = areaObjectId;
        teamworkFilter.idArea = areaObjectId;
        subteamworkFilter.idArea = areaObjectId;
      }

      if (idTeamwork && idTeamwork !== 'TODOS') {
        const teamworkObjectId = new mongoose.Types.ObjectId(idTeamwork);
        teamworkFilter.idTeamwork = teamworkObjectId;
        subteamworkFilter.idTeamwork = teamworkObjectId;
      }

      if (idSubteamwork && idSubteamwork !== 'TODOS') {
        subteamworkFilter.idSubteamwork = new mongoose.Types.ObjectId(idSubteamwork);
      }
      
      return {
        area: await this.service.countTakAreas(areaFilter),
        teamwork: await this.service.countTeamwork(teamworkFilter),
        subteamwork: await this.service.countSubteamwork(subteamworkFilter)
      }

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
