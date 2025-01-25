import { Controller, Get, Post, Body, Param, Delete, HttpCode, NotFoundException, Req, Put, ConflictException } from '@nestjs/common';
import { AreaService } from './area.service';

@Controller('area')
export class AreaController {
  constructor(
    private service: AreaService, 
  ){}

  @Get()
  buscar(@Req() req: Request){
    return this.service.list();
    
  }

  @Post()
  async crear(@Body() body: any, @Req() req: Request){
    try {
      const TabuscarArea = await this.service.createArea(body);
      return TabuscarArea
    } catch (error) {
      if(error.code === 11000){
        throw new ConflictException('The element already exists');
      }
      throw error;
    }
  }

  @Post('listAsync')
  async listAsyncArea(@Body() body: any, @Req() req: Request){
    try {
      const response = await this.service.listAsync( body );
      return response

    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  async actualizarArea(@Param('id')  id : string, @Body() body: any, @Req() req: Request){
    const res = await this.service.updateArea(id, body);
    if(!res) throw new NotFoundException('Item not found!');
    return res;
  }
  
  @Delete(':id')
  @HttpCode(204)
  async deleteArea(@Param('id') id:string, @Req() req: Request){
    const res = await this.service.deleteArea(id);
    if(!res) throw new NotFoundException('Elemento no eliminado...!');
    return res;
  }
}
