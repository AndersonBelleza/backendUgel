import { SchemaFactory, Prop, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({
  timestamps: true,
})

export class Derivations {

  @Prop({ default: '0', type: String })
  bool: string;

  @Prop({ type: Types.ObjectId, ref: 'Area' })
  idArea: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Area' })
  idAreaOld: Types.ObjectId;
  
  @Prop({ type: Date })
  dateOfDerive?: Date;
}

export const DerivationsSchema = SchemaFactory.createForClass(Derivations);
