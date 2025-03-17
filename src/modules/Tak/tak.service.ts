import { Injectable } from '@nestjs/common';
import { Tak } from './tak.schema';

import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class TakService {
  constructor(@InjectModel(Tak.name) private TakModel : Model<Tak>) {}

  async list(){
    return await this.TakModel.find();
  }

  async listAsync(body: any, skip: number = 0, limit: any = null) {
    const statusEnProcesoId = new mongoose.Types.ObjectId("6794048db1b6e0a91e3f4e85");
    const totalRecordsQuery = this.TakModel.countDocuments(body);
    const paginatedResultsQuery = this.TakModel.find(body)
    .populate([
      {
        path: 'idUser',
        select: 'username idArea idPerson',
        populate: [
          {
            path: 'idArea',
            select: 'name floorNumber',
          },
          {
            path: 'idPerson',
            select: 'firstName lastName',
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
      },
      {
        path: 'idTimePeriod',
        select: 'name color'
      }
    ])
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
    const [totalRecords, paginatedResults] = await Promise.all([
      totalRecordsQuery,
      paginatedResultsQuery
    ]);
    // Ordenar en código los resultados para "En proceso" primero
    const sortedResults = paginatedResults.sort((a: any, b: any) => {
      const statusA = String(a?.idStatusType?._id) === String(statusEnProcesoId) ? 0 : 1;
      const statusB = String(b?.idStatusType?._id) === String(statusEnProcesoId) ? 0 : 1;
      if (statusA !== statusB) {
        return statusA - statusB; // "En proceso" va primero
      }
      // Si ambos son iguales, ordenar por fecha de creación (descendente)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return {
      total: totalRecords,
      results: sortedResults
    };
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
