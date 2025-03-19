import { Controller, Get, Post, Body, Param, Delete, HttpCode, NotFoundException, Req, Put, ConflictException } from '@nestjs/common';
import { SubteamworkService } from './subteamwork.service';
import { StatusTypeService } from '../statusType/statusType.service';
import mongoose from 'mongoose';

@Controller('subteamwork')
export class SubteamworkController {
  constructor(
    private service: SubteamworkService, 
    private statusTypeService : StatusTypeService
  ){}

  @Get()
  search(@Req() req: Request){
    return this.service.list();
  }

  @Post()
  async create(@Body() body: any, @Req() req: Request) {
    try {
      const { idTeamwork, name } = body;
  
      const responseStatusType = await this.statusTypeService.findOne({ type: 'Default', name: 'Activo' });
      if (!responseStatusType) return { message: 'Status type "Activo" not found' };
      

      body.idStatusType = new mongoose.Types.ObjectId(responseStatusType._id);
  
      if (idTeamwork) body.idTeamwork = new mongoose.Types.ObjectId( idTeamwork );
      
      const responseExists = this.service.findOne({ name : name });
      if (!responseExists) return { message: 'The element already exists' };
      
      const response = await this.service.createSubteamwork(body);
  
      return response;
    } catch (error) {
      if (error.code === 11000) {
        return { message: 'The element already exists' };
      }
      return { message: error.message || 'An error occurred while creating the Subteamwork' };
    }
  }
  

  @Post('listAsync')
  async listAsyncSubteamwork(@Body() body: any, @Req() req: Request){
    try {
      const response = await this.service.listAll( body );
      return response

    } catch (error) {
      throw error;
    }
  }

  @Post('listSubteamworkAll')
  async listSubteamworkAll(@Body() body: any, @Req() req: Request){
    try {
      const { idTeamwork } = body;

      if( idTeamwork ) body.idTeamwork = new mongoose.Types.ObjectId(idTeamwork);

      const response = await this.service.listAll( body );
      return response

    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  async actualizarSubteamwork(@Param('id')  id : string, @Body() body: any, @Req() req: Request){
    const res = await this.service.updateSubteamwork(id, body);
    if(!res) throw new NotFoundException('Item not found!');
    return res;
  }
  
  @Delete(':id')
  @HttpCode(204)
  async deleteSubteamwork(@Param('id') id:string, @Req() req: Request){
    const res = await this.service.deleteSubteamwork(id);
    if(!res) throw new NotFoundException('Elemento no eliminado...!');
    return res;
  }
}
