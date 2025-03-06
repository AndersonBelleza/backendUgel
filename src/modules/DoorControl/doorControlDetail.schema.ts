import { SchemaFactory, Prop, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { Derivations } from "./derivations.schema";

@Schema({
  timestamps: true,
})

export class DoorControlDetail {
  @Prop({ default: '0', type: String })
  bool: string;

  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: String })
  paternalSurname: string;

  @Prop({ required: true, type: String })
  maternalSurname: string;
  
  @Prop({ required: true, type: String })
  dni: string;

  @Prop({ required: true, type: String })
  direction: string;

  @Prop({ required: true, type: String })
  ubigeo: string;

  @Prop({ type: String })
  photo?: string;

  @Prop({ type: Types.ObjectId, ref: 'Area' })
  idArea: Types.ObjectId;

  @Prop({ type: Date })
  entryTime?: Date;

  @Prop({ type: Date })
  departureTime?: Date;
  
  @Prop({ type: [ Derivations ] })
  derivations: [ Derivations ];
  
}

export const DoorControlDetailSchema = SchemaFactory.createForClass(DoorControlDetail);
