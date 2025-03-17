import { SchemaFactory, Prop, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({
  timestamps: true,
})

export class Person {

  @Prop({ default: '0', type: String })
  bool: string;

  @Prop({ required: true })
  name: string;
  
  @Prop({ required: true })
  paternalSurname: string;

  @Prop({ required: true })
  maternalSurname: string;

  @Prop({ required: false })
  typeDocument: string;
  
  @Prop({ required: false })
  document: string;

  @Prop({ required: false })
  sex: string;

  @Prop({ required: false })
  phone: string;

  @Prop({ required: false })
  email: string;

  @Prop({ type: Types.ObjectId, ref: 'StatusType' })
  idStatusType: Types.ObjectId;
  
}

export const PersonSchema = SchemaFactory.createForClass(Person);
