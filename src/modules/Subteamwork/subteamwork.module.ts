import { Module } from '@nestjs/common';
import { SubteamworkService } from './subteamwork.service';
import { SubteamworkController } from './subteamwork.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Subteamwork, SubteamworkSchema } from './subteamwork.schema';
import { StatusTypeModule } from '../statusType/statusType.module';

@Module({
  imports: [MongooseModule.forFeature([
    {
      name: Subteamwork.name,
      schema: SubteamworkSchema,
    },
  ]),
    StatusTypeModule
  ],
  controllers: [ SubteamworkController ],
  providers: [ SubteamworkService ],
  exports: [ SubteamworkService ]
  
})
export class SubteamworkModule {}
