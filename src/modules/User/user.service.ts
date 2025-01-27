import { Injectable } from '@nestjs/common';
import { User } from './user.schema';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private UserModel : Model<User>) {}

  async list(){
    return await this.UserModel.find();
  }

  async listAsync ( data : any = {} ){
    return await this.UserModel.find( data );
  }
  
  async createUser(crearUser : object){
    const nuevoUser = await this.UserModel.create(crearUser);
    return nuevoUser.save();
  }

  async updateUser(id: string, User : object){
    return await this.UserModel.findByIdAndUpdate(id, User);
  }

  async deleteUser(id: string){
    return await this.UserModel.findByIdAndDelete(id);
  }

}
