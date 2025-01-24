import { Module } from '@nestjs/common';
import { TakService } from './tak.service';
import { TakController } from './tak.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tak, TakSchema } from './tak.schema';

@Module({
  imports: [MongooseModule.forFeature([
    {
      name: Tak.name,
      schema: TakSchema,
    }
  ])],
  controllers: [ TakController ],
  providers: [ TakService ],
})
export class TakModule {}
