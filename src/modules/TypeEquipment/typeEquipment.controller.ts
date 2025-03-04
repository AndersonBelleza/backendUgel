import { Controller, Get, Post, Body, Param, Delete, HttpCode, NotFoundException, Req, Put, ConflictException } from '@nestjs/common';
import { TypeEquipmentService } from './typeEquipment.service';

@Controller('typeEquipment')
export class TypeEquipmentController {
  constructor(
    private service: TypeEquipmentService, 
  ){}

  @Get()
  buscar(@Req() req: Request){
    return this.service.list();
    
  }

  @Post()
  async create(@Body() body: any, @Req() req: Request){
    try {
      const response = await this.service.createTypeEquipment(body);
      return response
    } catch (error) {
      if(error.code === 11000){
        throw new ConflictException('The element already exists');
      }
      throw error;
    }
  }

  @Post('listAsync')
  async listAsyncTypeEquipment(@Body() body: any, @Req() req: Request){
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
  async actualizarTypeEquipment(@Param('id')  id : string, @Body() body: any, @Req() req: Request){
    const res = await this.service.updateTypeEquipment(id, body);
    if(!res) throw new NotFoundException('Item not found!');
    return res;
  }
  
  @Delete(':id')
  @HttpCode(204)
  async deleteTypeEquipment(@Param('id') id:string, @Req() req: Request){
    const res = await this.service.deleteTypeEquipment(id);
    if(!res) throw new NotFoundException('Elemento no eliminado...!');
    return res;
  }
}
