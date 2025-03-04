import { Injectable } from '@nestjs/common';
import { TypeEquipment } from './typeEquipment.schema';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class TypeEquipmentService {
  constructor(@InjectModel(TypeEquipment.name) private model : Model<TypeEquipment>) {}

  async list(){
    return await this.model.find();
  }

  async listAsync(data: any = {}) {
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
  
  async createTypeEquipment(crearTypeEquipment : object){
    const nuevoTypeEquipment = await this.model.create(crearTypeEquipment);
    return nuevoTypeEquipment.save();
  }

  async updateTypeEquipment(id: string, TypeEquipment : object){
    return await this.model.findByIdAndUpdate(id, TypeEquipment);
  }

  async deleteTypeEquipment(id: string){
    return await this.model.findByIdAndDelete(id);
  }

}
