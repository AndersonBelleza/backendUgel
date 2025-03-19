import { SchemaFactory, Prop, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({
  timestamps: true,
})

export class Area {

  @Prop({ type: Types.ObjectId, ref: 'StatusType' })
  idStatusType: Types.ObjectId;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ default: '0', type: String })
  bool: string;

  @Prop({ type: String })
  acronym: string;
  
}

export const AreaSchema = SchemaFactory.createForClass(Area);
