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

  async getResume(id: string) {
    const resumen = await this.TakModel.aggregate([
      {
        $match: { idUser: new mongoose.Types.ObjectId(id) } // Convertir idUser a ObjectId
      },
      {
        $group: {
          _id: "$idStatusType",
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "statustypes", // Nombre de la colección de estados
          localField: "_id",
          foreignField: "_id",
          as: "status"
        }
      },
      {
        $unwind: "$status"
      },
      {
        $project: {
          _id: 0,
          statusName: "$status.name",
          count: 1
        }
      }
    ]);

      const allStatuses = await this.TakModel.db.collection("statustypes").find({ type: "Tak" }).toArray();

      const resumenFinal = allStatuses.reduce((acc, status) => {
        acc[status.name] = 0;
        return acc;
      }, { Total: 0 }); 

      resumen.forEach(({ statusName, count }) => {
        resumenFinal[statusName] = count;
        resumenFinal.Total += count;
      });
      return resumenFinal;
  }

  async findAll( body : any = {}){
    return await this.TakModel.find(body);
  }

  async listAsync(body: any, skip: number = 0, limit: any = null) {
    const totalRecordsQuery = this.TakModel.countDocuments(body);
    const paginatedResultsQuery = this.TakModel.find(body)
    .populate([
      {
        path: 'idUser',
        select: 'username idArea idPerson',
        populate: [
          {
            path: 'idArea',
            select: 'name acronym',
          },
          {
            path: 'idSubteamwork',
            select: 'name floorNumber',
          },
          {
            path: 'idPerson',
            select: 'name paternalSurname maternalSurname',
          },
        ],
      },
      {
        path: 'idTechnical',
        select: 'username idArea idPerson',
        populate: [
          {
            path: 'idPerson',
            select: 'name paternalSurname maternalSurname',
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
    .sort({ updatedAt: - 1 })      
    .lean()
    .exec();

    const [totalRecords, paginatedResults] = await Promise.all([
      totalRecordsQuery,
      paginatedResultsQuery
    ]);
    
    // Ordenar primero por 'En Proceso'
    const sortedResults = paginatedResults.sort((a: any, b: any) => {
      const statusOrder = {
        "En proceso": 0, // Primero
        "Pendiente": 1,  // Segundo
      };
    
      const statusA = statusOrder[a?.idStatusType?.name] ?? 2;
      const statusB = statusOrder[b?.idStatusType?.name] ?? 2;
    
      if (statusA !== statusB) {
        return statusA - statusB; // Ordena según la prioridad definida en `statusOrder`
      }
    
      // Si están en la misma categoría, ordenar por fecha descendente
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

  async countTakAreas ( body : any ) {
    return this.TakModel.aggregate([
      {
        $match: body  // Aquí se usa el body tal como viene
      },
      {
        $group : {
          _id : "$idArea",
          total: { $sum : 1 }
        }
      },
      {
        $lookup: {
          from : "areas",
          localField: '_id',
          foreignField: '_id',
          as: 'areaDetails'
        }
      },
      {
        $unwind: "$areaDetails"
      },
      {
        $project: {
          _id : 1,
          name: "$areaDetails.name",
          total: 1
        }
      }
    ])
  }

  async countTeamwork ( body: any ) {
    return this.TakModel.aggregate([
      {
        $match: body  // Aquí se usa el body tal como viene
      },
      {
        $group : {
          _id : "$idTeamwork",
          total: { $sum : 1 }
        }
      },
      {
        $lookup: {
          from : "teamworks",
          localField: '_id',
          foreignField: '_id',
          as: 'teamworkDetails'
        }
      },
      {
        $unwind: "$teamworkDetails"
      },
      {
        $project: {
          _id : 1,
          name: "$teamworkDetails.name",
          idArea: "$teamworkDetails.idArea",
          total: 1
        }
      }
    ])
  }

  async countSubteamwork ( body : any ) {
    return this.TakModel.aggregate([
      {
        $match: body  // Aquí se usa el body tal como viene
      },
      {
        $group : {
          _id : "$idSubteamwork",
          total: { $sum : 1 }
        }
      },
      {
        $lookup: {
          from : "subteamworks",
          localField: '_id',
          foreignField: '_id',
          as: 'subteamworkDetails'
        }
      },
      {
        $unwind: "$subteamworkDetails"
      },
      {
        $project: {
          _id : 1,
          idArea: "$subteamworkDetails.idArea",
          name: "$subteamworkDetails.name",
          idTeamwork: "$subteamworkDetails.idTeamwork",
          total: 1
        }
      }
    ])
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
              select: 'name acronym', // Solo incluye estos campos
            },
          },
          {
            path: 'idUser', // Relación principal
            populate: {
              path: 'idArea', // Relación dentro de idUser
              select: 'name acronym', // Solo incluye estos campos
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
              select: 'name ',
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
