import { Controller, Get, Post, Body, Param, Delete, HttpCode, NotFoundException, Req, Put, ConflictException } from '@nestjs/common';
import { UserService } from './user.service';
import UserInterface from 'src/interfaces/User.interface';
import * as bcrypt from 'bcryptjs'
import { StatusTypeService } from '../statusType/statusType.service';
import mongoose, { Types } from 'mongoose';
import { PersonService } from '../Person/person.service';
import { AreaService } from '../Area/area.service';
import { SubteamworkService } from '../Subteamwork/subteamwork.service';

@Controller('user')
export class UserController {
  constructor(
    private service: UserService,
    private areaService: AreaService,
    private subteamworkService : SubteamworkService,
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

  @Get('listTechnical')
  async listTechnical(@Req() req: Request) {
    try {
      
      const responseSubteamwork = await this.subteamworkService.findOne({ name: 'TECNOLOGÍA DE LA INFORMACIÓN' });
      
      if( responseSubteamwork ) {
        const responseStatus = await this.statusTypeService.findOne({ name: 'Activo', type: 'User' });
        const response = await this.service.list({ idSubteamwork: responseSubteamwork?._id, idStatusType: new mongoose.Types.ObjectId(responseStatus?._id) });
        return response;
      }

      return [];

    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('El elemento ya existe.');
      }
      throw error;
    }
  }  

  @Post('createUserAndPerson')
  async createUserAndPerson(@Body() body: UserInterface, @Req() req: Request) {
    try {
      const dataPerson: any = body;
  
      const existingUser = await this.service.findOne({ username: body.username });
      if (existingUser) {
        return { message: 'El nombre de usuario ya está en uso.' };
      }
  
      // 🔒 Encriptamos la contraseña
      const passwordEncrypted = await bcrypt.hash(body.password, 15);
      body.password = passwordEncrypted;
  
      // 🚦 Estado por defecto (ACTIVO)
      const responseStatusType = await this.statusTypeService.findOne({ 
        name: 'Activo', 
        type: 'User' 
      });
      
      if (responseStatusType) body.idStatusType = new mongoose.Types.ObjectId(responseStatusType?._id)
  
      if (dataPerson.name && dataPerson.paternalSurname && dataPerson.maternalSurname) {
        let responsePerson = await this.personService.findOne({
          name: { $regex: new RegExp(`^${dataPerson?.name}$`, 'i') },
          paternalSurname: { $regex: new RegExp(`^${dataPerson?.paternalSurname}$`, 'i') },
          maternalSurname: { $regex: new RegExp(`^${dataPerson?.maternalSurname}$`, 'i') },
        });
  
        if (!responsePerson) {
          // Si no existe, la registramos
          responsePerson = await this.personService.createPerson({
            name: dataPerson?.name,
            paternalSurname: dataPerson?.paternalSurname,
            maternalSurname: dataPerson?.maternalSurname
          });
        } else {
          // Si la persona ya tiene usuario, devolvemos un mensaje
          const existingPersonWithUser = await this.service.findOne({ idPerson: responsePerson._id });
          if (existingPersonWithUser) {
            return { message: 'La persona ya cuenta con un usuario registrado.' };
          }
        }
  
        body.idPerson = responsePerson._id;
      }   
  
      // 🚀 Creamos el usuario si pasa todas las validaciones
      const dataUser = {
        username: body.username,
        password: body.password,
        role: body.role,
        dateCreate: new Date().toISOString(),
        idArea: new mongoose.Types.ObjectId(body.idArea),
        idPerson: new mongoose.Types.ObjectId(body.idPerson),
        idStatusType: new mongoose.Types.ObjectId(body.idStatusType),
        idTeamwork: new mongoose.Types.ObjectId(body.idTeamwork),
        idSubteamwork: new mongoose.Types.ObjectId(body.idSubteamwork),
      };
  
      const response = await this.service.createUser(dataUser);
      return response;
  
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('El elemento ya existe.');
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
    const res = await this.service.updateUser(id, { idStatusType : new mongoose.Types.ObjectId(responseStatusType?._id) });

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
      if( dataPerson.name != responsePerson?.name || dataPerson.paternalSurname != responsePerson?.paternalSurname || dataPerson.maternalSurname != responsePerson?.maternalSurname ) {
        await this.personService.updatePerson(body?.idPerson, dataPerson);
      } 
      
      const dataUser = {
        username : body.username,
        role: body.role,
        dateCreate: new Date().toISOString(),
        idPerson: new mongoose.Types.ObjectId(body.idPerson),
        idArea: new mongoose.Types.ObjectId(body.idArea),
        idTeamwork: new mongoose.Types.ObjectId(body.idTeamwork),
        idSubteamwork: new mongoose.Types.ObjectId(body.idSubteamwork),
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
