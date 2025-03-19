import { Module } from '@nestjs/common';
import { AreaService } from './area.service';
import { AreaController } from './area.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Area, AreaSchema } from './area.schema';
import { StatusTypeModule } from '../statusType/statusType.module';

@Module({
  imports: [MongooseModule.forFeature([
    {
      name: Area.name,
      schema: AreaSchema,
    },
  ]),
    StatusTypeModule
  ],
  controllers: [ AreaController ],
  providers: [ AreaService ],
  exports: [ AreaService ]
  
})
export class AreaModule {}
