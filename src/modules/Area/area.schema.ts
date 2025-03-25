import { SchemaFactory, Prop, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({
  timestamps: true,
})

export class Area {
  @Prop({ default: '0', type: String })
  bool: string;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ type: String })
  acronym: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  idResponsible?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'StatusType' })
  idStatusType: Types.ObjectId;
  
}

export const AreaSchema = SchemaFactory.createForClass(Area);
