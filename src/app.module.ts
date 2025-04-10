import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiConsumerModule } from './modules/api-consumer/api-consumer.module';
import { TakModule } from './modules/Tak/tak.module';
import { UserModule } from './modules/User/user.module';
import { AreaModule } from './modules/Area/area.module';
import { PersonModule } from './modules/Person/person.module';
import { ConfigModule } from './modules/Config/config.module';
import { AuthModule } from './modules/auth/auth-user.module';
import { DoorControlModule } from './modules/DoorControl/doorControl.module';

import { ImagesController } from './modules/images/images.controller'
import { TeamworkModule } from './modules/Teamwork/teamwork.module';
import { SubteamworkModule } from './modules/Subteamwork/subteamwork.module';
import { InterestLaborModule } from './modules/InterestLabor/interestLabor.module';
import { PdfModule } from './modules/Pdf/pdf.module';
import { CommmomIssueModule } from './modules/commomIssue/commomIssue.module';

@Module({
  imports: [
    MongooseModule.forRoot("mongodb://localhost:27017/system_ugel"),
    ApiConsumerModule,
    AuthModule,
    ConfigModule,
    TakModule,
    UserModule,
    AreaModule,
    TeamworkModule,
    SubteamworkModule,
    PersonModule,
    DoorControlModule,
    InterestLaborModule,
    PdfModule,
    CommmomIssueModule
  ],
  controllers: [ ImagesController ],
  providers: [],
})
export class AppModule {}
