import { SchemaFactory, Prop, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({
  timestamps: true,
})

export class User {
  // Campos tipo ObjectId
  @Prop({ type: Types.ObjectId, ref: 'Person' })
  idPerson: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'StatusType' })
  idStatusType: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Area' })
  idArea: Types.ObjectId;

  @Prop({ required: false }) // Campo obligatorio
  password: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  role: string;

  @Prop({ default: '0', type: String })
  bool: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: Date })
  dateExpired: Date;

  @Prop({ type: Date, default: Date.now })
  dateCreate: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
