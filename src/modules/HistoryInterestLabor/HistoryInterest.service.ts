import { Injectable } from '@nestjs/common';
import { HistoryInterest } from './HistoryInterest.schema';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class HistoryInterestService {
  constructor(@InjectModel(HistoryInterest.name) private model : Model<HistoryInterest>) {}

  async list(){
    return await this.model.find();
  }

  async listAsync(body: any, skip: number = 0, limit: any = null) {
    const totalRecordsQuery = this.model.countDocuments(body);
    const paginatedResultsQuery = this.model.find(body)
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

  async listAll(data: any = {}) {
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
  
  async createHistoryInterest(crearHistoryInterest : object){
    const nuevoHistoryInterest = await this.model.create(crearHistoryInterest);
    return nuevoHistoryInterest.save();
  }

  async updateHistoryInterest(id: string, HistoryInterest : object){
    return await this.model.findByIdAndUpdate(id, HistoryInterest);
  }

  async deleteHistoryInterest(id: string){
    return await this.model.findByIdAndDelete(id);
  }

}
