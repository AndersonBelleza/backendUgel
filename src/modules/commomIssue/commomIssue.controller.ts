import { Body, ConflictException, Controller, Delete, HttpCode, NotFoundException, Param, Post, Put, Req } from "@nestjs/common";
import { CommomIssueService } from "./commomIssue.service";
import { StatusTypeService } from "../statusType/statusType.service";
import mongoose from "mongoose";

@Controller('commomIssue')
export class CommomIssueController{
  constructor(
    private commomIssueService: CommomIssueService,
    private statusPriorityService: StatusTypeService
  ){}

  @Post('listAsync')
  async listAsyncCommomIssue(@Body() body:any, @Req() req: Request){
    try{
      const response = await this.commomIssueService.CommomIssueAsync( body );
      return response
    }catch(error){
      throw error;
    }
  }
  @Post()
  async create(@Body() body:any, @Req() req:Request){
    try{
      const responseStatusType = await this.statusPriorityService.findOne({ type: 'Default', name: 'Activo' });
      if ( responseStatusType ) body.idStatusType = new mongoose.Types.ObjectId(responseStatusType?._id);
      if (body.idPriority) {
        body.idPriority = new mongoose.Types.ObjectId(body.idPriority);
      }
      const response = await this.commomIssueService.createCommomIssue(body);
      return response
    }catch(error){
      if(error.code===11000){
        throw new ConflictException('Already exist')
      }
      throw error
    }
  }
  
  @Put(':id')
  async UpdateArea(@Param('id')  id : string, @Body() body: any, @Req() req: Request){
    
    const { idStatusType,idPriority} = body;

    // if( idResponsible ) body.idResponsible = new mongoose.Types.ObjectId(idResponsible);
    // if( idStatusType ) body.idStatusType = new mongoose.Types.ObjectId(idStatusType);
    if( idPriority ) body.idPriority = new mongoose.Types.ObjectId(idStatusType);

    const res = await this.commomIssueService.updateCommomIssue(id, body);
    if(!res) throw new NotFoundException('Item not found!');
    return res;
  }
  
  @Delete(':id')
  @HttpCode(204)
  async deleteArea(@Param('id') id:string, @Req() req: Request){
    const res = await this.commomIssueService.deleteCommomIssue(id);
    if(!res) throw new NotFoundException('Elemento no eliminado...!');
    return res;
  }
}