import { SchemaFactory, Prop, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({
  timestamps: true,
})

export class HistoryInterest {

  @Prop({ default: '0', type: String })
  bool: string;

  @Prop({default: '#fff', type: String })
  color: string;

  @Prop({ type: String })
  person: string;

  @Prop({ type: String })
  codeModule: string;

  @Prop({ type: String })
  dateStringEnd: string;

  @Prop({ type: String })
  dateStringInit: string;

  @Prop({ type: String })
  resolutionRecognition: string;

  @Prop({default: [], type: [Object]})
  data?: [];

  @Prop({ type: Date })
  date: Date;
  
}

export const HistoryInterestSchema = SchemaFactory.createForClass(HistoryInterest);
