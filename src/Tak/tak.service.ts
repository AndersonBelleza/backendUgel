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
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0); // Inicio del día actual
  
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999); // Fin del día actual
    return await this.TakModel.find( data )
    .find({
      createdAt: { $gte: todayStart, $lte: todayEnd }, // Filtro por fecha actual
    })
    .sort({ createdAt: -1 }) 
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
  
  async deleteTak(id: string){
    return await this.TakModel.findByIdAndDelete(id);
  }

  async updateTak(id: string, Tak : object){
    return this.TakModel.findByIdAndUpdate(id, Tak, {
      new: true, // Retorna el documento actualizado
      runValidators: true, // Ejecuta las validaciones definidas en el esquema
    });
  }

  async findById(id: string) {
    return this.TakModel.findById(id)
      .populate({
        path: 'idUser', // Relación principal
        populate: {
          path: 'idArea', // Relación dentro de idUser
          select: 'name floorNumber', // Solo incluye estos campos
        },
      })
      .populate('idStatusType') // Populate para idStatusType
      .populate('idStatusPriority'); // Populate para idStatusPriority
  }

    // Soft delete: marcar un registro como eliminado
    async softDelete(id: string): Promise<boolean> {
      const tak = await this.TakModel.findById(id);
      if (!tak || tak.isDeleted) {
        // Si no existe o ya está eliminado, devolver null
        return false;
      }
  
      tak.isDeleted = true;
      tak.deletedAt = new Date();
      await tak.save(); // Guardar los cambios
      return true; // Retorna true si fue exitoso
    }
}
