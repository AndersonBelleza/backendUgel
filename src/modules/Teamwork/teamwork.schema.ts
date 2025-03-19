import { SchemaFactory, Prop, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({
  timestamps: true,
})

export class Teamwork {
  
  @Prop({ default: '0', type: String })
  bool: string;

  @Prop({ required: true, unique: true })
  name: string;
  
  @Prop({ type: Types.ObjectId, ref: 'Area' })
  idArea: Types.ObjectId;
  
  @Prop({ type: Types.ObjectId, ref: 'StatusType' })
  idStatusType: Types.ObjectId;

}

export const TeamworkSchema = SchemaFactory.createForClass(Teamwork);
