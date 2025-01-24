import { SchemaFactory, Prop, Schema } from "@nestjs/mongoose";

@Schema({
  timestamps: true
})

export class ApiConsumer{
 
  @Prop({required: true, trim: true, type:String})
  query: string;

  @Prop({default: '0', type: String})
  json: string;

  @Prop({type: String})
  cod: string;
}

export const ApiConsumerSchema = SchemaFactory.createForClass(ApiConsumer);