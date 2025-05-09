import { SchemaFactory, Prop, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({
  timestamps: true,
})

export class CommomIssue {

  @Prop({ default: '0', type: String })
  bool: string;

  @Prop({ type: String, required: true })
  issue: string;

  @Prop({ type: Types.ObjectId, ref: 'StatusType'})
  idPriority: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'StatusType'})
  idStatusType: Types.ObjectId;
}

export const CommomIssueSchema = SchemaFactory.createForClass(CommomIssue);
