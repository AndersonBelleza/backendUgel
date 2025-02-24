import { Controller, Get, Post, Body, Param, Delete, HttpCode, NotFoundException, Req, Put, ConflictException } from '@nestjs/common';
import { UserService } from './user.service';
import UserInterface from 'src/interfaces/User.interface';
import * as bcrypt from 'bcryptjs'
import { StatusTypeService } from '../statusType/statusType.service';
import mongoose, { Types } from 'mongoose';
import { PersonService } from '../Person/person.service';

@Controller('user')
export class UserController {
  constructor(
    private service: UserService,
    private statusTypeService: StatusTypeService,
    private personService : PersonService
  ){}

  @Get()
  buscar(@Req() req: Request){
    return this.service.list();
    
  }

  @Post()
  async crear(@Body() body: UserInterface, @Req() req: Request){
    try {

      const response = await this.service.createUser(body);
      return response
    } catch (error) {
      if(error.code === 11000){
        throw new ConflictException('The element already exists');
      }
      throw error;
    }
  }

  @Post('createUserAndPerson')
  async createUserAndPerson(@Body() body: UserInterface, @Req() req: Request){
    try {
      const dataPerson : any = body;
      
      // ! Encriptamos la contraseña
      const passwordEncrypted = await bcrypt.hash( body.password, 15 );
      body.password = passwordEncrypted;

      const responseStatusType = await this.statusTypeService.findOne( { name: 'Activo', type: 'User' } ); // Aqui irá el estado ACTIVO (Default)
      if (responseStatusType) body.idStatusType = new Types.ObjectId( responseStatusType?._id.toString() );

      //! lÓGICA PARA REGISTRAR PERSONA O VALIDAR SI EXISTE.
      if( dataPerson.firstName && dataPerson.lastName ) {
        let responsePerson : any = {};
        responsePerson = await this.personService.findOne({
          firstName: { $regex: new RegExp(`^${dataPerson?.firstName}$`, 'i') },
          lastName: { $regex: new RegExp(`^${dataPerson?.lastName}$`, 'i') },
        });      

        if( !responsePerson ) {
          responsePerson = await this.personService.createPerson({
            firstName: dataPerson?.firstName,
            lastName: dataPerson?.lastName
          })
        }

        //! Verificamos si la persona ya tiene una cuenta con USUARIO
        const responseExistsWithUser = await this.service.findOne({ idPerson : responsePerson?._id });
        if( responseExistsWithUser ) return { message : 'La persona ya cuenta con un usuario disponible.'};

        body.idPerson = responsePerson?._id
      }   

      const dataUser = {
        username : body.username,
        password: body.password,
        role: body.role,
        dateCreate: new Date().toISOString(),
        idArea: new mongoose.Types.ObjectId(body.idArea?.toString()),
        idPerson: body.idPerson,
        idStatusType: body.idStatusType,
      };

      const response = await this.service.createUser(dataUser);
      return response;

    } catch (error) {
      if(error.code === 11000){
        throw new ConflictException('The element already exists');
      }
      throw error;
    }
  }

  @Post('listAsyncUser')
  async listAsyncUser(@Body() body: any, @Req() req: Request){
    try {
      let skip = 0;

      const { page, limit } = body;

      if(page && limit) skip = page * limit

      return this.service.listAsync({}, skip, limit); // ´Pasar nueva data del body.

    } catch (error) {
      throw error;
    }
  }

  @Put('updateUserStatusType/:id')
  async updateUserStatusType(@Param('id')  id : string, @Body() body: any, @Req() req: Request){
    const { nameStatus } = body;
    let nameSearch = 'Activo';
    nameStatus == 'Activo' ? nameSearch = 'Inactivo' : 'Activo';
    const responseStatusType = await this.statusTypeService.findOne({ name : nameSearch, type: 'User' });
    const res = await this.service.updateUser(id, { idStatusType : new mongoose.Types.ObjectId(responseStatusType?._id.toString())});
    if(!res) throw new NotFoundException('Item not found!');
    return res;
  }

  @Put(':id')
  async actualizarUser(@Param('id')  id : string, @Body() body: any, @Req() req: Request){
    const res = await this.service.updateUser(id, body);
    if(!res) throw new NotFoundException('Item not found!');
    return res;
  }

  @Put('updateUserAndPerson/:id')
  async updateUserAndPerson(@Param('id')  id : string, @Body() body: any, @Req() req: Request){
    try {
      const idProcess = body?.idProcess;

      const dataPerson : any = body;

      const responseStatusType = await this.statusTypeService.findOne( { name: 'Activo', type: 'User' } ); // Aqui irá el estado ACTIVO (Default)
      if (responseStatusType) body.idStatusType = new Types.ObjectId( responseStatusType?._id.toString() );

      const responsePerson = await this.personService.findOne({ _id : body?.idPerson });
      
      //! lÓGICA PARA ACTUALIZAR A UNA PERSONA ( Solo pasará a actualizarse cuando haya un cambio en el nombre de la persona. )
      if( dataPerson.firstName != responsePerson?.firstName || dataPerson.lastName != responsePerson?.lastName ) {
        await this.personService.updatePerson(body?.idPerson, dataPerson);
      } 
      
      const dataUser = {
        username : body.username,
        role: body.role,
        dateCreate: new Date().toISOString(),
        idArea: new mongoose.Types.ObjectId(body.idArea?.toString()),
        idPerson: body.idPerson
      };

      const response = await this.service.updateUser(idProcess, dataUser);
      return response;

    } catch (error) {
      if(error.code === 11000){
        throw new ConflictException('The element already exists');
      }
      throw error;
    }
  }
  
  @Put('updateUserPassword/:id')
  async updateUserPassword(@Param('id')  id : string, @Body() body: any, @Req() req: Request){
    try {

      const passwordEncrypted = await bcrypt.hash( body.password, 15 );
      const response = await this.service.updateUser( id, { password : passwordEncrypted });
      if( !response ) return { message : 'Error al cambiar la contraseña'};
      
      return response;

    } catch (error) {
      if(error.code === 11000){
        throw new ConflictException('The element already exists');
      }
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteUser(@Param('id') id:string, @Req() req: Request){
    const res = await this.service.deleteUser(id);
    if(!res) throw new NotFoundException('Elemento no eliminado...!');
    return res;
  }
}
