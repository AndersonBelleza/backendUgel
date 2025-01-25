import { SchemaFactory, Prop, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({
  timestamps: true
})

export class Tak {

  @Prop({default: '0', type: String})
  bool: string;

  @Prop({ type: String})
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  idUser: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'StatusType' })
  idStatusType: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'StatusType' })
  idStatusPriority: Types.ObjectId;

}

export const TakSchema = SchemaFactory.createForClass(Tak);