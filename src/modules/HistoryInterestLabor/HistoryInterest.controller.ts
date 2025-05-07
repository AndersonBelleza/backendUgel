import { Controller, Get, Post, Body, Param, Delete, HttpCode, NotFoundException, Req, Put, ConflictException } from '@nestjs/common';
import { HistoryInterestService } from './HistoryInterest.service';

@Controller('historyInterest')
export class HistoryInterestController {
  constructor(
    private service: HistoryInterestService, 
  ){}

  @Get()
  buscar(@Req() req: Request){
    return this.service.list();
    
  }
  
  @Post('listAsync')
  async listAsyncHistoryInterest(@Body() body: any, @Req() req: Request){
    try {
      const response = await this.service.listAsync( body );
      return response

    } catch (error) {
      throw error;
    }
  }

  @Post()
  async create(@Body() body: any, @Req() req: Request){
    try {
      const response = await this.service.createHistoryInterest(body);
      return response
    } catch (error) {
      if(error.code === 11000){
        throw new ConflictException('The element already exists');
      }
      throw error;
    }
  }

  @Put(':id')
  async updateInterestLabor(@Param('id')  id : string, @Body() body: any, @Req() req: Request){
    const res = await this.service.updateHistoryInterest(id, body);
    if(!res) throw new NotFoundException('Item not found!');
    return res;
  }
  
  @Delete(':id')
  @HttpCode(204)
  async deleteInterestLabor(@Param('id') id:string, @Req() req: Request){
    const res = await this.service.deleteHistoryInterest(id);
    if(!res) throw new NotFoundException('Elemento no eliminado...!');
    return res;
  }
}
