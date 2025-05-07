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
import { HistoryInterestModule } from './modules/HistoryInterestLabor/HistoryInterest.module';

@Module({
  imports: [
    MongooseModule.forRoot("mongodb+srv://bellezatorresanderson:2yRteAB38FimVOGX@cluster0.mo2lj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"),
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
    CommmomIssueModule,
    HistoryInterestModule
  ],
  controllers: [ ImagesController ],
  providers: [],
})
export class AppModule {}
