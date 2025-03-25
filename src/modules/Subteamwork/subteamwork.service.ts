import { Injectable } from '@nestjs/common';
import { Subteamwork } from './subteamwork.schema';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class SubteamworkService {
  constructor(@InjectModel(Subteamwork.name) private SubteamworkModel : Model<Subteamwork>) {}

  async list(){
    return await this.SubteamworkModel.find();
  }

  async findOne( data : any = {} ){
    return await this.SubteamworkModel.findOne( data );
  }

  async listAll ( data : any = {} ){
    return await this.SubteamworkModel.find( data )
      .populate([
        {
          path: 'idTeamwork',
          select: 'name idArea',
          populate: ([
            {
              path: 'idArea',
              select: 'name acronym'
            }
          ])
        },
        {
          path: 'idStatusType',
          select: 'name color'
        }
      ])  
      .lean()
      .exec();;
  }
  
  async createSubteamwork(crearSubteamwork : object){
    const nuevoSubteamwork = await this.SubteamworkModel.create(crearSubteamwork);
    return nuevoSubteamwork.save();
  }

  async updateSubteamwork(id: string, Subteamwork : object){
    return await this.SubteamworkModel.findByIdAndUpdate(id, Subteamwork);
  }

  async deleteSubteamwork(id: string){
    return await this.SubteamworkModel.findByIdAndDelete(id);
  }

}
