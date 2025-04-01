import { Controller, Get, Post, Body, Param, Delete, HttpCode, NotFoundException, Req, Put, ConflictException } from '@nestjs/common';
import { InterestLaborService } from './interestLabor.service';

@Controller('interestLabor')
export class InterestLaborController {
  constructor(
    private service: InterestLaborService, 
  ){}

  @Get()
  buscar(@Req() req: Request){
    return this.service.list();
    
  }

  @Post()
  async create(@Body() body: any, @Req() req: Request){
    try {
      const response = await this.service.createInterestLabor(body);
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
    const res = await this.service.updateInterestLabor(id, body);
    if(!res) throw new NotFoundException('Item not found!');
    return res;
  }
  
  @Delete(':id')
  @HttpCode(204)
  async deleteInterestLabor(@Param('id') id:string, @Req() req: Request){
    const res = await this.service.deleteInterestLabor(id);
    if(!res) throw new NotFoundException('Elemento no eliminado...!');
    return res;
  }
}
