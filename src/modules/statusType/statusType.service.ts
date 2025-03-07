import { Injectable } from '@nestjs/common';
import { StatusType } from './statusType.schema';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class StatusTypeService {
  constructor(@InjectModel(StatusType.name) private model : Model<StatusType>) {}

  async list(){
    return await this.model.find();
  }

  async listAsync(data: any = {}) {
    // Se puede validar si `data.type` está presente.
    const filter = data.type ? { type: data.type } : {};
    return await this.model.find(filter);
  }

  async listStatusAsync(body: any, skip: number = 0, limit: any = null) {
    const totalRecordsQuery = this.model.countDocuments(body);
    const paginatedResultsQuery = this.model.find(body)
      // .populate([
      //   {
      //     path: 'idStatusType',
      //     select: 'name color'
      //   },
      //   {
      //     path: 'idPerson',
      //     select: 'firstName lastName'
      //   },
      //   {
      //     path: 'idArea',
      //     select: 'name floorNumber'
      //   },
      // ])
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

  async findOne( data : any ){
    return await this.model.findOne(data);
  }

  async findAll( data : any ){
    return await this.model.find(data);
  }
  
  async createStatusType(crearStatusType : object){
    const nuevoStatusType = await this.model.create(crearStatusType);
    return nuevoStatusType.save();
  }

  async updateStatusType(id: string, StatusType : object){
    return await this.model.findByIdAndUpdate(id, StatusType);
  }

  async deleteStatusType(id: string){
    return await this.model.findByIdAndDelete(id);
  }

}
