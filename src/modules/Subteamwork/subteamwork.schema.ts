import { SchemaFactory, Prop, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({
  timestamps: true,
})

export class Subteamwork {
  
  @Prop({ default: '0', type: String })
  bool: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  floorNumber: string;
  
  @Prop({ type: Types.ObjectId, ref: 'Teamwork' })
  idTeamwork: Types.ObjectId;
  
  @Prop({ type: Types.ObjectId, ref: 'StatusType' })
  idStatusType: Types.ObjectId;

}

export const SubteamworkSchema = SchemaFactory.createForClass(Subteamwork);
