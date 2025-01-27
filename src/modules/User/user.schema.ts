import { SchemaFactory, Prop, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({
  timestamps: true,
})

export class User {
  @Prop({ default: '0', type: String })
  bool: string;

  @Prop({ type: Types.ObjectId, ref: 'Person' })
  idPerson: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'StatusType' })
  idStatusType: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Area' })
  idArea: Types.ObjectId;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: false }) // Campo obligatorio
  password: string;

  @Prop({ required: true })
  role: string;

  @Prop({ type: Date })
  dateExpired: Date;

  @Prop({ type: Date, default: Date.now })
  dateCreate: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
