import { Injectable } from '@nestjs/common';
import { User } from './user.schema';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private model: Model<User>) { }

  async list( data : any = {}) {
    return await this.model.find(data)    
    .populate([
      {
        path: 'idPerson',
        select: 'name paternalSurname maternalSurname',
      }
    ])
    .sort({ createdAt: 'desc' })
    .lean()
    .exec();
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
          select: 'name paternalSurname maternalSurname',
        },
        {
          path: 'idArea',
          select: 'name acronym'
        },
        {
          path: 'idTeamwork',
          select: 'name'
        },
        {
          path: 'idSubteamwork',
          select: 'name acronym'
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

  async findOne(data: any = {}) {
    return await this.model.findOne(data)
    .populate([
      {
        path: 'idPerson',
        select: 'name paternalSurname maternalSurname',
      },
      {
        path: 'idArea',
        select: 'name acronym idResponsible',
      },
      {
        path: 'idTeamwork',
        select: 'name idResponsible',
      },
      {
        path: 'idSubteamwork',
        select: 'name floorNumber',
      }
    ]);
  }

  async searchIdUser(id: string) {
    return await this.model.findById(id)
  }

  async createUser(crearUser: object) {
    const nuevoUser = await this.model.create(crearUser);
    return nuevoUser.save();
  }

  async updateUser(id: string, User: object) {
    return await this.model.findByIdAndUpdate(id, User);
  }

  async deleteUser(id: string) {
    return await this.model.findByIdAndDelete(id);
  }

}
