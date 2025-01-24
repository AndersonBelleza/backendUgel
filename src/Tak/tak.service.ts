import { Injectable } from '@nestjs/common';
import { Tak } from './tak.schema';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class TakService {
  constructor(@InjectModel(Tak.name) private TakModel : Model<Tak>) {}

  async listar(){
    return await this.TakModel.find();
  }
  
  async crearTak(crearTak : object){
    const nuevoTak = await this.TakModel.create(crearTak);
    return nuevoTak.save();
  }

  async actualizarTak(id: string, Tak : object){
    return await this.TakModel.findByIdAndUpdate(id, Tak);
  }

  async eliminarTak(id: string){
    return await this.TakModel.findByIdAndDelete(id);
  }

}
