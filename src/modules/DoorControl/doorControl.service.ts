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

  async listAsyncDoorControlOfPerson(body: any, skip: number = 0, limit: any = null) {
    // Paso 1: Contar el total de elementos en el array 'peoples'
    const totalRecordsQuery = this.model.aggregate([
      { $match: body }, // Filtra los documentos según el cuerpo
      { $unwind: "$peoples" }, // Deshacer el array PEOPLES
      { $count: "total" } // Contar los elementos deshechos
    ]);
  
    // Paso 2: Obtener los resultados paginados para 'peoples' y hacer el populate de 'idArea'
    const paginatedResultsQuery = this.model.aggregate([
      { $match: body }, // Filtra los documentos según el cuerpo
      { $unwind: "$peoples" }, // Deshacer el array PEOPLES
      { $skip: skip }, // Salta los primeros 'skip' elementos
      { $limit: limit }, // Limita los resultados a 'limit'
      { $sort: { createdAt: -1 } }, // Ordena los resultados por 'createdAt' en orden descendente
      { $lookup: { 
          from: 'Area', 
          localField: 'peoples.idArea',
          foreignField: '_id',
          as: 'idArea'
        }
      },
      { 
        $group: {
          _id: null, // Agrupar todo en un solo documento
          peoples: { $push: "$peoples" } // Volver a agrupar solo 'peoples'
        }
      },
      { 
        $project: { 
          _id: 0, // No incluir el _id del documento
          peoples: 1 // Incluir solo el array de 'peoples'
        }
      }
    ]);
  
    // Paso 3: Combinar los resultados y devolverlos
    return Promise.all([totalRecordsQuery, paginatedResultsQuery])
      .then(([totalRecords, paginatedResults]) => {
        return {
          total: totalRecords.length > 0 ? totalRecords[0].total : 0, // Total de elementos en PEOPLES
          results: paginatedResults.length > 0 ? paginatedResults[0].peoples : [] // Solo devolver el array de 'peoples'
        };
      });
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
