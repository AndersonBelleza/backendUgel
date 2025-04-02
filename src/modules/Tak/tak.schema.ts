import { SchemaFactory, Prop, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({
  timestamps: true
})

export class Tak {

  @Prop({default: '0', type: String})
  bool: string;

  @Prop({ default: '0', type: String })
  code: string;
  
  @Prop({ default: '0', type: String })
  correlative: string;

  @Prop({ type: String, required: true })
  issue: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: String })
  diagnosis: string;

  @Prop({ type: String })
  solution: string;

  @Prop({ type: String })
  recommendation: string;

  @Prop({ type: Types.ObjectId, ref: 'Area' }) //! Area que registra ()
  idArea: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Teamwork' }) //! Teamwork FUNCIONARIO ()
  idTeamwork?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Subteamwork' }) // Usuario TECNICO/INFORMATICO ()
  idSubteamwork?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' }) // Usuario que registra - JEFE ()
  
  @Prop({ default: '0', type: Number })
  qualification: number;
  
  @Prop({ type: Types.ObjectId, ref: 'User' })
  idUser: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' }) // Usuario TECNICO/INFORMATICO ()
  idTechnical?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'StatusType' })
  idStatusType: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'StatusType' })
  idStatusPriority: Types.ObjectId;
  
  @Prop({ type: Types.ObjectId, ref: 'StatusType' })
  idTimePeriod: Types.ObjectId;

  @Prop({default: [], type: [Object]})
  evidence?: [];

  @Prop({default: [], type: [Object]})
  evidenceUser?: [];
  
}

export const TakSchema = SchemaFactory.createForClass(Tak);