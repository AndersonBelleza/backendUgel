import { SchemaFactory, Prop, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({
  timestamps: true,
})

export class StatusType {

  @Prop({ default: '0', type: String })
  bool: string;

  @Prop({ default: '#fff', type: String })
  color: string;

  @Prop({ required: false })
  type: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: String })
  description: string;

}

export const StatusTypeSchema = SchemaFactory.createForClass(StatusType);
StatusTypeSchema.index({ name: 1, type: 1 }, { unique: true });
