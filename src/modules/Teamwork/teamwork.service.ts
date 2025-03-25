import { Injectable } from '@nestjs/common';
import { Teamwork } from './teamwork.schema';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class TeamworkService {
  constructor(@InjectModel(Teamwork.name) private TeamworkModel : Model<Teamwork>) {}

  async list(){
    return await this.TeamworkModel.find();
  }

  async findOne( data : any = {} ){
    return await this.TeamworkModel.findOne( data );
  }

  async listAsync ( data : any = {} ){
    return await this.TeamworkModel.find( data )
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
  
  async createTeamwork(crearTeamwork : object){
    const nuevoTeamwork = await this.TeamworkModel.create(crearTeamwork);
    return nuevoTeamwork.save();
  }

  async updateTeamwork(id: string, Teamwork : object){
    return await this.TeamworkModel.findByIdAndUpdate(id, Teamwork);
  }

  async deleteTeamwork(id: string){
    return await this.TeamworkModel.findByIdAndDelete(id);
  }

}
