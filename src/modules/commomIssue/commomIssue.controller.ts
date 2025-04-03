import { Body, ConflictException, Controller, Post, Req } from "@nestjs/common";
import { CommomIssueService } from "./commomIssue.service";
import { StatusTypeService } from "../statusType/statusType.service";

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
      const response = await this.commomIssueService.findOne({ type: 'Default', name: 'Activo' });
    }catch(error){
      if(error.code===11000){
        throw new ConflictException('Already exist')
      }
      throw error
    }
  }
  
}