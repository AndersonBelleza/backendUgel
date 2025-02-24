import { SchemaFactory, Prop, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { DoorControlDetail } from "./doorControlDetail.schema";

@Schema({
  timestamps: true,
})

export class DoorControl {
  @Prop({ default: '0', type: String })
  bool: string;

  @Prop({ required: true, unique: true, type: String })
  code: string;

  @Prop({unique: true, type: [DoorControlDetail] })
  peoples: [DoorControlDetail];
  
}

export const DoorControlSchema = SchemaFactory.createForClass(DoorControl);
