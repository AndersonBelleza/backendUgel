import { Injectable } from '@nestjs/common';
import { Tak } from './tak.schema';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class TakService {
  constructor(@InjectModel(Tak.name) private TakModel : Model<Tak>) {}

  async list(){
    return await this.TakModel.find();
  }

  async listAsync ( data : any = {} ){
    return await this.TakModel.find( data )
    .populate([
      {
        path: 'idUser',
        select: 'username idArea',
        populate: [
          {
            path: 'idArea',
            select: 'name floorNumber'
          }
        ]
      },
      {
        path: 'idStatusType',
        select: 'color name'
      },
      {
        path: 'idStatusPriority',
        select: 'color name'
      }
    ])
  }
  
  async createTak(crearTak : object){
    const nuevoTak = await this.TakModel.create(crearTak);
    return nuevoTak.save();
  }

  async updateTak(id: string, Tak : object){
    return await this.TakModel.findByIdAndUpdate(id, Tak);
  }

  async deleteTak(id: string){
    return await this.TakModel.findByIdAndDelete(id);
  }

}
