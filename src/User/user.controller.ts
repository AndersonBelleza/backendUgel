import { Controller, Get, Post, Body, Param, Delete, HttpCode, NotFoundException, Req, Put, ConflictException } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private service: UserService, 
  ){}

  @Get()
  buscar(@Req() req: Request){
    return this.service.list();
    
  }

  @Post()
  async crear(@Body() body: any, @Req() req: Request){
    try {
      const TabuscarUser = await this.service.createUser(body);
      return TabuscarUser
    } catch (error) {
      if(error.code === 11000){
        throw new ConflictException('The element already exists');
      }
      throw error;
    }
  }

  @Post('listAsync')
  async listAsyncUser(@Body() body: any, @Req() req: Request){
    try {
      const response = await this.service.listAsync( body );
      return response

    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  async actualizarUser(@Param('id')  id : string, @Body() body: any, @Req() req: Request){
    const res = await this.service.updateUser(id, body);
    if(!res) throw new NotFoundException('Item not found!');
    return res;
  }
  
  @Delete(':id')
  @HttpCode(204)
  async deleteUser(@Param('id') id:string, @Req() req: Request){
    const res = await this.service.deleteUser(id);
    if(!res) throw new NotFoundException('Elemento no eliminado...!');
    return res;
  }
}
