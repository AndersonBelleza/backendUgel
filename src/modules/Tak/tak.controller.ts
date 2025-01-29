import { Controller, Get, Post, Body, Param, Delete, HttpCode, NotFoundException, Req, Put, ConflictException } from '@nestjs/common';
import { TakService } from './tak.service';
import { WebSocketGateway } from './tak.gateway';
import { StatusTypeService } from '../statusType/statusType.service';

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
      if( responseStatusType ) body.idStatusType = responseStatusType?._id

      const TabuscarTak = await this.service.createTak(body);

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
      let skip = 0;
      const { page, limit } = body;

      if(page && limit) skip = page * limit

      return this.service.listAsync({}, skip, limit); // ´Pasar nueva data del body.

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

  @Put('update/:id')
  async update(@Param('id') id: string, @Body() body: any, @Req() req: Request) {
    try {
      const updatedTak = await this.service.updateTak(id, body);
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
