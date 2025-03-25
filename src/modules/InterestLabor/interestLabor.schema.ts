import { SchemaFactory, Prop, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({
  timestamps: true,
})

export class InterestLabor {

  @Prop({ default: '0', type: String })
  bool: string;

  @Prop({ default: '#fff', type: String })
  color: string;

  @Prop({ default: '#fff', type: Number })
  year: number;

  @Prop({default: [], type: [Object]})
  months?: [];
  
}

export const InterestLaborSchema = SchemaFactory.createForClass(InterestLabor);
