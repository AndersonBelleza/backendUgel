import { Module } from '@nestjs/common';
import { TakService } from './tak.service';
import { TakController } from './tak.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tak, TakSchema } from './tak.schema';
import { WebSocketGateway } from './tak.gateway';
import { UserModule } from '../User/user.module';
import { StatusTypeModule } from '../statusType/statusType.module';
import { TeamworkModule } from '../Teamwork/teamwork.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Tak.name,
        schema: TakSchema,
      }
    ]),
    UserModule,
    StatusTypeModule,
    TeamworkModule
  ],
  controllers: [ TakController ],
  providers: [ TakService, WebSocketGateway ],
  exports: [ TakService ]
  
})
export class TakModule {}
