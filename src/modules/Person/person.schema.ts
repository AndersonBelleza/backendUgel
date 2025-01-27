import { SchemaFactory, Prop, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({
  timestamps: true,
})

export class Person {

  @Prop({ default: '0', type: String })
  bool: string;

  @Prop({ required: true })
  firstName: string;
  
  @Prop({ required: true })
  lastName: string;

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
