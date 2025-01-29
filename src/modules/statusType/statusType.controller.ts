import { Controller, Get, Post, Body, Param, Delete, HttpCode, NotFoundException, Req, Put, ConflictException } from '@nestjs/common';
import { StatusTypeService } from './statusType.service';

@Controller('statusType')
export class StatusTypeController {
  constructor(
    private service: StatusTypeService, 
  ){}

  @Get()
  buscar(@Req() req: Request){
    return this.service.list();
    
  }

  @Post()
  async create(@Body() body: any, @Req() req: Request){
    try {
      const response = await this.service.createStatusType(body);
      return response
    } catch (error) {
      if(error.code === 11000){
        throw new ConflictException('The element already exists');
      }
      throw error;
    }
  }

  @Post('listAsync')
  async listAsyncStatusType(@Body() body: any, @Req() req: Request){
    try {
      const response = await this.service.listAsync( body );
      return response

    } catch (error) {
      throw error;
    }
  }

  @Post('searchByType')
  async searchByType(@Body() body: any, @Req() req: Request){
    try {
      const response = await this.service.findAll( { type: body?.type } );
      return response
    } catch (error) {
      throw error;
    }
  }


  @Post('listTypeAll')
  async listTypeAll(@Body() body: any, @Req() req: Request){
    try {
      const response = await this.service.listAsync( body );
      return response
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  async actualizarStatusType(@Param('id')  id : string, @Body() body: any, @Req() req: Request){
    const res = await this.service.updateStatusType(id, body);
    if(!res) throw new NotFoundException('Item not found!');
    return res;
  }
  
  @Delete(':id')
  @HttpCode(204)
  async deleteStatusType(@Param('id') id:string, @Req() req: Request){
    const res = await this.service.deleteStatusType(id);
    if(!res) throw new NotFoundException('Elemento no eliminado...!');
    return res;
  }
}
