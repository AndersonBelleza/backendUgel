import { Controller, Get, Post, Body, Param, Delete, HttpCode, NotFoundException, Req, Put, ConflictException } from '@nestjs/common';
import { TakService } from './tak.service';
import { WebSocketGateway } from './tak.gateway';

@Controller('tak')
export class TakController {
  constructor(
    private service: TakService, 
    private gateway: WebSocketGateway
  ){}

  @Get()
  buscar(@Req() req: Request){
    return this.service.list();
    
  }

  @Post()
  async crear(@Body() body: any, @Req() req: Request){
    try {
      const TabuscarTak = await this.service.createTak(body);
      // Emitir el evento WebSocket para agregar un registro
      this.gateway.emitEvent('takAdded', TabuscarTak);
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
      const response = await this.service.listAsync( body );
      return response

    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  async actualizar(@Param('id') id: string, @Body() body: any, @Req() req: Request) {
    try {
      // Intentar actualizar el elemento en la base de datos
      const updatedTak = await this.service.updateTak(id, body);
  
      // Si no se encuentra el elemento, lanzar una excepción
      if (!updatedTak) throw new NotFoundException('Item not found!');
  
      // Buscar el elemento completo desde la base de datos para garantizar consistencia
      const fullTak = await this.service.findById(id);
      if (!fullTak) throw new NotFoundException('Item not found after update!');
  
      // Emitir el evento `takUpdated` con los datos completos
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
