import { Controller, Get, Post, Body, Param, Delete, HttpCode, NotFoundException, Req, Put, ConflictException } from '@nestjs/common';
import { TeamworkService } from './teamwork.service';
import { StatusTypeService } from '../statusType/statusType.service';
import mongoose from 'mongoose';

@Controller('teamwork')
export class TeamworkController {
  constructor(
    private service: TeamworkService, 
    private statusTypeService : StatusTypeService
  ){}

  @Get()
  search(@Req() req: Request){
    return this.service.list();
  }

  @Post()
  async crear(@Body() body: any, @Req() req: Request) {
    try {
      const { idArea, name } = body;
  
      const responseStatusType = await this.statusTypeService.findOne({ type: 'Default', name: 'Activo' });
      if (!responseStatusType) return { message: 'Status type "Activo" not found' };
      

      body.idStatusType = new mongoose.Types.ObjectId(responseStatusType._id);
  
      if (idArea) body.idArea = new mongoose.Types.ObjectId( idArea );
      
      const responseExists = this.service.findOne({ name : name });
      if (!responseExists) return { message: 'The element already exists' };
      
      const response = await this.service.createTeamwork(body);
  
      return response;
    } catch (error) {
      if (error.code === 11000) {
        return { message: 'The element already exists' };
      }
      return { message: error.message || 'An error occurred while creating the teamwork' };
    }
  }
  

  @Post('listAsync')
  async listAsyncTeamwork(@Body() body: any, @Req() req: Request){
    try {
      const response = await this.service.listAsync( body );
      return response

    } catch (error) {
      throw error;
    }
  }

  @Post('listTeamworkAll')
  async listTeamworkAll(@Body() body: any, @Req() req: Request){
    try {
      const { idArea } = body;

      if( idArea ) body.idArea = new mongoose.Types.ObjectId(idArea);

      const response = await this.service.listAsync( body );
      return response

    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  async actualizarTeamwork(@Param('id')  id : string, @Body() body: any, @Req() req: Request){
    const res = await this.service.updateTeamwork(id, body);
    if(!res) throw new NotFoundException('Item not found!');
    return res;
  }
  
  @Delete(':id')
  @HttpCode(204)
  async deleteTeamwork(@Param('id') id:string, @Req() req: Request){
    const res = await this.service.deleteTeamwork(id);
    if(!res) throw new NotFoundException('Elemento no eliminado...!');
    return res;
  }
}
