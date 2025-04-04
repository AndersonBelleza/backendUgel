import { Injectable } from "@nestjs/common";
import { CommomIssue } from "./commomIssue.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import path from "path";

@Injectable()
export class CommomIssueService {
  constructor(@InjectModel(CommomIssue.name) private CommomIssueModel : Model<CommomIssue>) {}

  async CommomIssueAsync(body: any, skip: number = 0, limit: any = null) {
    const totalRecordsQuery = this.CommomIssueModel.countDocuments(body);
    const paginatedResultsQuery = this.CommomIssueModel.find(body)
      .populate([
        {
          path: 'idPriority',
          select: 'name color'
        },
        {
          path: 'idStatusType',
          select: 'name color'
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

  async findOne( data : any ){
    return await this.CommomIssueModel.findOne(data);
  }

  async createCommomIssue(crearCommomIssue : object){
    const newCommomIssue = await this.CommomIssueModel.create(crearCommomIssue);
    return newCommomIssue.save();
  }

  async updateCommomIssue(id: string, CommomIssue : object){
    return await this.CommomIssueModel.findByIdAndUpdate(id, CommomIssue);
  }

  async deleteCommomIssue(id: string){
    return await this.CommomIssueModel.findByIdAndDelete(id);
  }
}