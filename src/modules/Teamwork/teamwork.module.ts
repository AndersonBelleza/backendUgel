import { Module } from '@nestjs/common';
import { TeamworkService } from './teamwork.service';
import { TeamworkController } from './teamwork.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Teamwork, TeamworkSchema } from './teamwork.schema';
import { StatusTypeModule } from '../statusType/statusType.module';

@Module({
  imports: [MongooseModule.forFeature([
    {
      name: Teamwork.name,
      schema: TeamworkSchema,
    },
  ]),
    StatusTypeModule
  ],
  controllers: [ TeamworkController ],
  providers: [ TeamworkService ],
  exports: [ TeamworkService ]
  
})
export class TeamworkModule {}
