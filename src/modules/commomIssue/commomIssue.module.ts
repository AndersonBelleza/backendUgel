import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CommomIssue, CommomIssueSchema } from "./commomIssue.schema";
import { CommomIssueController } from "./commomIssue.controller";
import { CommomIssueService } from "./commomIssue.service";
import { StatusTypeModule } from "../statusType/statusType.module";

@Module({
  imports:[MongooseModule.forFeature([
    {
     name: CommomIssue.name,
     schema: CommomIssueSchema 
    }
  ]),
  CommmomIssueModule,
  StatusTypeModule
  ],
  controllers:[CommomIssueController],
  providers:[CommomIssueService],
  exports:[CommomIssueService]
})
export class CommmomIssueModule {}