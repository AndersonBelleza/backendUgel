import { SchemaFactory, Prop, Schema } from "@nestjs/mongoose";

@Schema({
  timestamps: true
})

export class Tak {

  @Prop({default: '0', type: String})
  bool: string;

}

export const TakSchema = SchemaFactory.createForClass(Tak);