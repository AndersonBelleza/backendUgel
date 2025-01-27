import { Controller, Get, Post, Body, Param, Delete, HttpCode, NotFoundException, Req, Put, ConflictException } from '@nestjs/common';
import { PersonService } from './person.service';

@Controller('person')
export class PersonController {
  constructor(
    private service: PersonService, 
  ){}

  @Get()
  buscar(@Req() req: Request){
    return this.service.list();
  }

  @Post()
  async crear(@Body() body: any, @Req() req: Request){
    try {
      const response = await this.service.createPerson(body);
      return response
    } catch (error) {
      if(error.code === 11000){
        throw new ConflictException('The element already exists');
      }
      throw error;
    }
  }

  @Post('listAsync')
  async listAsyncPerson(@Body() body: any, @Req() req: Request){
    try {
      const response = await this.service.listAsync( body );
      return response

    } catch (error) {
      throw error;
    }
  }

  @Post('listPersonAll')
  async listPersonAll(@Body() body: any, @Req() req: Request){
    try {
      const response = await this.service.listAsync( body );
      return response

    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  async updatePerson(@Param('id')  id : string, @Body() body: any, @Req() req: Request){
    const res = await this.service.updatePerson(id, body);
    if(!res) throw new NotFoundException('Item not found!');
    return res;
  }
  
  @Delete(':id')
  @HttpCode(204)
  async deletePerson(@Param('id') id:string, @Req() req: Request){
    const res = await this.service.deletePerson(id);
    if(!res) throw new NotFoundException('Elemento no eliminado...!');
    return res;
  }
}
