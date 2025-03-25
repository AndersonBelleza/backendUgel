import { Injectable } from '@nestjs/common';
import { Area } from './area.schema';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import path from 'path';

@Injectable()
export class AreaService {
  constructor(@InjectModel(Area.name) private AreaModel : Model<Area>) {}

  async list(){
    return await this.AreaModel.find();
  }

  async findOne( data : any = {} ){
    return await this.AreaModel.findOne( data );
  }

  async listAsync ( data : any = {} ){
    return await this.AreaModel.find( data )
    .populate([
      {
        path: 'idResponsible',
        populate: [
          {
            path: 'idPerson',
            select: 'name paternalSurname maternalSurname'
          }
        ]
      },
      {
        path: 'idStatusType',
        select: 'name color'
      }
    ]).exec();
  }
  
  async createArea(crearArea : object){
    const nuevoArea = await this.AreaModel.create(crearArea);
    return nuevoArea.save();
  }

  async updateArea(id: string, Area : object){
    return await this.AreaModel.findByIdAndUpdate(id, Area);
  }

  async deleteArea(id: string){
    return await this.AreaModel.findByIdAndDelete(id);
  }

}
