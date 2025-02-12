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

  async listAsync(body: any, skip: number = 0, limit: any = null) {
    const totalRecordsQuery = this.TakModel.countDocuments(body);
    const paginatedResultsQuery = this.TakModel.find(body)
    .populate([
      {
        path: 'idUser',
        select: 'username idArea',
        populate: [
          {
            path: 'idArea',
            select: 'name floorNumber',
          },
        ],
      },
      {
        path: 'idStatusType',
        select: 'name color'
      },
      {
        path: 'idStatusPriority',
        select: 'name color'
      }
    ])
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })      
    .lean()
    .exec();

    return Promise.all([totalRecordsQuery, paginatedResultsQuery])
    .then(([totalRecords, paginatedResults]) => {
      return {
        total: totalRecords,
        results: paginatedResults
      };
    });
  }

  async countTak ( body : any = { }) {
    const totalRecordsQuery = this.TakModel.countDocuments(body);
    return totalRecordsQuery;
  }
  
  async createTak(crearTak : object){
    const nuevoTak = await this.TakModel.create(crearTak);
    return this.findById(nuevoTak._id.toString());
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
      .populate([
          {
            path: 'idUser', // Relación principal
            populate: {
              path: 'idArea', // Relación dentro de idUser
              select: 'name floorNumber', // Solo incluye estos campos
            },
          },
          {
            path: 'idUser', // Relación principal
            populate: {
              path: 'idArea', // Relación dentro de idUser
              select: 'name floorNumber', // Solo incluye estos campos
            },
          }
        ])
  }
    
    async listByUserAsync(body: any, skip: number = 0, limit: any = null) {
      const totalRecordsQuery = this.TakModel.countDocuments(body);
    const paginatedResultsQuery = this.TakModel.find(body)
      // return await this.TakModel.find(body)
        .sort({ createdAt: -1 })
        .populate([
          {
            path: 'idUser',
            select: 'username idArea',
            populate: [
              {
                path: 'idArea',
                select: 'name floorNumber',
              },
            ],
          },
          {
            path: 'idStatusType',
            select: 'color name',
          },
          {
            path: 'idStatusPriority',
            select: 'color name',
          },
        ])
        .skip(skip)
        .limit(limit)
        // .sort({ createdAt: 'desc' })
        .lean()
        .exec();
      return Promise.all([totalRecordsQuery, paginatedResultsQuery])
      .then(([totalRecords, paginatedResults]) => {
        return {
          total: totalRecords,
          results: paginatedResults
        };
      });
    }
}
