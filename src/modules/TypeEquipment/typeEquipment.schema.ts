import { SchemaFactory, Prop, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({
  timestamps: true,
})

export class TypeEquipment {

  @Prop({ default: '0', type: String })
  bool: string;

  @Prop({ default: '#fff', type: String })
  color: string;

  @Prop({ required: false })
  type: string;

  @Prop({ required: true, unique: true })
  serialNumber: string;

  @Prop({ type: String })
  brand: string;

  @Prop({ type: String })
  model: string;

  @Prop({ type: String })
  location: string;
}

export const TypeEquipmentSchema = SchemaFactory.createForClass(TypeEquipment);
