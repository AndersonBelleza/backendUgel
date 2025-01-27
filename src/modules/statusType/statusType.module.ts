import { Module } from '@nestjs/common';
import { StatusTypeService } from './statusType.service';
import { StatusTypeController } from './statusType.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StatusType, StatusTypeSchema } from './statusType.schema';

@Module({
  imports: [MongooseModule.forFeature([
    {
      name: StatusType.name,
      schema: StatusTypeSchema,
    }
  ])],
  controllers: [ StatusTypeController ],
  providers: [ StatusTypeService ],
})

export class StatusTypeModule {}
