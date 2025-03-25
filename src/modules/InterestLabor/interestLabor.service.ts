import { Injectable } from '@nestjs/common';
import { InterestLabor } from './interestLabor.schema';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class InterestLaborService {
  constructor(@InjectModel(InterestLabor.name) private model : Model<InterestLabor>) {}

  async list(){
    return await this.model.find();
  }

  async listAll(data: any = {}) {
    // Se puede validar si `data.type` está presente.
    const filter = data.type ? { type: data.type } : {};
    return await this.model.find(filter);
  }

  async findOne( data : any ){
    return await this.model.findOne(data);
  }

  async findAll( data : any ){
    return await this.model.find(data);
  }
  
  async createInterestLabor(crearInterestLabor : object){
    const nuevoInterestLabor = await this.model.create(crearInterestLabor);
    return nuevoInterestLabor.save();
  }

  async updateInterestLabor(id: string, InterestLabor : object){
    return await this.model.findByIdAndUpdate(id, InterestLabor);
  }

  async deleteInterestLabor(id: string){
    return await this.model.findByIdAndDelete(id);
  }

}
