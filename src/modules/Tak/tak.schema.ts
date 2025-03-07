import { SchemaFactory, Prop, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({
  timestamps: true
})

export class Tak {

  @Prop({default: '0', type: String})
  bool: string;

  @Prop({ default: '0', type: String })
  code: string;
  
  @Prop({ default: '0', type: String })
  correlative: string;

  @Prop({ type: String, required: true })
  issue: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: String })
  diagnosis: string;

  @Prop({ type: String })
  solution: string;

  @Prop({ type: String })
  recommendation: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  idUser: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'StatusType' })
  idStatusType: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'StatusType' })
  idStatusPriority: Types.ObjectId;
  
  @Prop({ type: Types.ObjectId, ref: 'StatusType' })
  idTimePeriod: Types.ObjectId;

  @Prop({default: [], type: [Object]})
  evidence?: [];
  
}

export const TakSchema = SchemaFactory.createForClass(Tak);