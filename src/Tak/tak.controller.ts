import { Controller, Get, Post, Body, Param, Delete, HttpCode, NotFoundException, Req, Put, ConflictException } from '@nestjs/common';
import { TakService } from './tak.service';

@Controller('tak')
export class TakController {
  constructor(
    private service: TakService, 
  ){}

  @Get()
  buscar(@Req() req: Request){
    return this.service.listar();
    
  }

  @Post()
  async crear(@Body() body: any, @Req() req: Request){
    try {
      const TabuscarTak = await this.service.crearTak(body);
      return TabuscarTak
    } catch (error) {
      if(error.code === 11000){
        throw new ConflictException('The element already exists');
      }
      throw error;
    }
  }

  @Put(':id')
  async actualizar(@Param('id')  id : string, @Body() body: any, @Req() req: Request){
    const res = await this.service.actualizarTak(id, body);
    if(!res) throw new NotFoundException('Item not found!');
    return res;
  }
  
  @Delete(':id')
  @HttpCode(204)
  async eliminar(@Param('id') id:string, @Req() req: Request){
    const res = await this.service.eliminarTak(id);
    if(!res) throw new NotFoundException('Elemento no eliminado...!');
    return res;
  }
}
