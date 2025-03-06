import { Injectable } from '@nestjs/common';
import { DoorControl } from './doorControl.schema';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { DoorControlDetail } from './doorControlDetail.schema';

@Injectable()
export class DoorControlService {
  constructor(@InjectModel(DoorControl.name) private model: Model<DoorControl>) { }

  async list() {
    return await this.model.find();
  }

  async listAsync(body: any, skip: number = 0, limit: any = null) {
    const totalRecordsQuery = this.model.countDocuments(body);
    const paginatedResultsQuery = this.model.find(body)
      .populate([
        {
          path: 'idStatusType',
          select: 'name color'
        },
        {
          path: 'idPerson',
          select: 'firstName lastName'
        },
        {
          path: 'idArea',
          select: 'name floorNumber'
        },
      ])
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: 'desc' })
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

  async listAsyncDoorControlOfPerson(body: any, query: any, skip: number = 0, limit: any = null) {
    // Contar el total de registros dentro de 'peoples' que cumplen la condición
    const totalRecordsQuery = this.model.aggregate([
      { $match: body }, // Filtrar documentos principales
      { $unwind: "$peoples" }, // Desglosar el array 'peoples'
      { $match: query }, // Aplicar filtro en 'peoples'
      { $count: "total" } // Contar coincidencias
    ]);
  
    // Obtener los resultados paginados dentro de 'peoples'
    const paginatedResultsQuery = this.model.aggregate([
      { $match: body }, // Filtrar documentos principales
      { $unwind: "$peoples" }, // Desglosar 'peoples'
      { $match: query }, // Filtrar elementos dentro de 'peoples'
      { $sort: { "peoples.createdAt": -1 } }, // Ordenar los resultados
      { $skip: skip }, // Aplicar paginación
      { $limit: limit }, // Limitar los resultados

      { $project: { _id: 0, peoples: 1 } } // Mantener solo 'peoples'
    ]);
  
    // Ejecutar ambas consultas en paralelo y devolver los resultados
    return Promise.all([totalRecordsQuery, paginatedResultsQuery]).then(
      ([totalRecords, paginatedResults]) => {
        return {
          total: totalRecords.length > 0 ? totalRecords[0].total : 0,
          results: paginatedResults.map(item => item.peoples)
        };
      }
    );
  }
  
  async findOne(data: any = {}) {
    return await this.model.findOne(data)
  }

  async searchIdDoorControl(id: string) {
    return await this.model.findById(id)
  }

  async createDoorControl(crearDoorControl: object) {
    const nuevoDoorControl = await this.model.create(crearDoorControl);
    return nuevoDoorControl.save();
  }

  async updateDoorControl(id: string, DoorControl: object) {
    return await this.model.findByIdAndUpdate(id, DoorControl);
  }

  async updateDoorControlOfPerson(id: string, doorControlObject: any) {
    return await this.model.findByIdAndUpdate(
      id,
      {
        $push: {
          peoples: doorControlObject
        }
      },
      { new: true } // Para devolver el documento actualizado
    );
  }
  
  async deleteDoorControl(id: string) {
    return await this.model.findByIdAndDelete(id);
  }

}
