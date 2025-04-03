import { Controller, Get, Post, Body, Param, Delete, HttpCode, NotFoundException, Req, Put, ConflictException } from '@nestjs/common';
import { DoorControlService } from './doorControl.service';
import * as bcrypt from 'bcryptjs'
import { StatusTypeService } from '../statusType/statusType.service';
import mongoose, { Types } from 'mongoose';
import { PersonService } from '../Person/person.service';
import { DoorControlInterface } from 'src/interfaces/DoorControl.interface';
import { generateCodeIssue } from 'src/libs';

@Controller('doorControl')
export class DoorControlController {
  constructor(
    private service: DoorControlService,
    private statusTypeService: StatusTypeService
  ){}

  @Get()
  buscar(@Req() req: Request){
    return this.service.list();
    
  }
 
  @Post()
  async crear(@Body() body: DoorControlInterface, @Req() req: Request){
    try {

      const response = await this.service.createDoorControl(body);
      return response
    } catch (error) {
      if(error.code === 11000){
        throw new ConflictException('The element already exists');
      }
      throw error;
    }
  }

  @Post('createDoorControlOfPerson') //DoorControlInterface
  async createDoorControlAndPerson(@Body() body: any, @Req() req: Request){
    try {

      const codeGenerate = generateCodeIssue();

      // Se verifica si el día existe en el doorControl
      let existsDoorControlCode = await this.service.findOne({ code: codeGenerate });
      if( !existsDoorControlCode ) existsDoorControlCode = await this.service.createDoorControl({ code : codeGenerate });

      const idDoorControl = existsDoorControlCode?._id;

      // Se obtiene todos los datos de la persona a registrar
      const response = await this.service.updateDoorControlOfPerson(idDoorControl.toString(), body);
      return response;

    } catch (error) {
      if(error.code === 11000){
        throw new ConflictException('The element already exists');
      }
      throw error;
    }
  }

  @Post('listAsyncDoorControlOfPerson')
  async listAsyncDoorControlOfPerson(@Body() body: any, @Req() req: Request) {
    try {
      let skip = 0;
      let query: any = {};
  
      const { page, limit, dni, name, idArea, timeStart, timeEnd } = body;
  
      if (dni) query["peoples.dni"] = dni;

      if (name) {
        query["$or"] = [
          { "peoples.name": { $regex: name, $options: "i" } },
          { "peoples.paternalSurname": { $regex: name, $options: "i" } },
          { "peoples.maternalSurname": { $regex: name, $options: "i" } }
        ];
      }
      
      if (timeStart || timeEnd) {
        const today = new Date();
    
        // Procesar timeStart
        let startDate;
        if (timeStart && timeStart.includes(":")) {
          const [hours, minutes] = timeStart.split(":").map(Number);
          startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes, 0, 0);
        } else {
          startDate = timeStart ? new Date(timeStart) : today;
        }
    
        // Procesar timeEnd
        let endDate;
        if (timeEnd && timeEnd.includes(":")) {
          const [hours, minutes] = timeEnd.split(":").map(Number);
          endDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), hours, minutes, 59, 999);
        } else {
          endDate = timeEnd ? new Date(timeEnd) : new Date(startDate);
          endDate.setHours(23, 59, 59, 999);
        }
        
        query['peoples.entryTime'] = { $gte: startDate, $lte: endDate };
        
      }
      
      if( idArea ) query["peoples.idArea"] = idArea;
  
      if (page && limit) skip = page * limit;
  
      const codeGenerate = generateCodeIssue();
      const response = await this.service.listAsyncDoorControlOfPerson(
        { code: codeGenerate },
        query,
        skip,
        limit
      );
  
      return response;
    } catch (error) {
      throw error;
    }
  }
  
  @Put('updateDoorControlStatusType/:id')
  async updateDoorControlStatusType(@Param('id')  id : string, @Body() body: any, @Req() req: Request){
    const { nameStatus } = body;
    let nameSearch = 'Activo';
    nameStatus == 'Activo' ? nameSearch = 'Inactivo' : 'Activo';
    const responseStatusType = await this.statusTypeService.findOne({ name : nameSearch, type: 'DoorControl' });
    const res = await this.service.updateDoorControl(id, { idStatusType : new mongoose.Types.ObjectId(responseStatusType?._id.toString())});
    if(!res) throw new NotFoundException('Item not found!');
    return res;
  }

  @Put('updateFinallyDoorControlForPerson/:id')
  async updateFinallyDoorControlForPerson(@Param('id') id: string, @Body() body: any, @Req() req: Request) {
    const codeGenerate = generateCodeIssue();
  
    const res : any = await this.service.findOne({ code: codeGenerate });
    if (!res) throw new NotFoundException('Item not found!');
  
    const personIndex = res.peoples.findIndex(( person : any ) => person.id === id);

    res.peoples[personIndex].departureTime = body.departureTime;

    return await this.service.updateDoorControl(res?._id, { peoples : res.peoples })
  }
  
  @Put('updateDeriveDoorControlForPerson/:id')
  async updateDeriveDoorControlForPerson(@Param('id') id: string, @Body() body: any, @Req() req: Request) {
    const codeGenerate = generateCodeIssue();
  
    const res : any = await this.service.findOne({ code: codeGenerate });
    if (!res) throw new NotFoundException('Item not found!');
  
    const personIndex = res.peoples.findIndex(( person : any ) => person.id === id);
    res.peoples[personIndex].derivations = [ body.derivations, ...res.peoples[personIndex].derivations ];

    return await this.service.updateDoorControl(res?._id, { peoples : res.peoples })
  }

  @Put(':id')
  async actualizarDoorControl(@Param('id')  id : string, @Body() body: any, @Req() req: Request){
    const res = await this.service.updateDoorControl(id, body);
    if(!res) throw new NotFoundException('Item not found!');
    return res;
  }

  @Put('updateDoorControlAndPerson/:id')
  async updateDoorControlAndPerson(@Param('id')  id : string, @Body() body: any, @Req() req: Request){
    try {
      const idProcess = body?.idProcess;
      const response = await this.service.updateDoorControl(idProcess, body);
      return response;

    } catch (error) {
      if(error.code === 11000){
        throw new ConflictException('The element already exists');
      }
      throw error;
    }
  }
  
  @Delete(':id')
  @HttpCode(204)
  async deleteDoorControl(@Param('id') id:string, @Req() req: Request){
    const res = await this.service.deleteDoorControl(id);
    if(!res) throw new NotFoundException('Elemento no eliminado...!');
    return res;
  }
}
