import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiConsumerModule } from './modules/api-consumer/api-consumer.module';
import { TakModule } from './modules/Tak/tak.module';
import { UserModule } from './modules/User/user.module';
import { AreaModule } from './modules/Area/area.module';



@Module({
  imports: [
    MongooseModule.forRoot("mongodb+srv://bellezatorresanderson:2yRteAB38FimVOGX@cluster0.mo2lj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"),
    ApiConsumerModule,
    TakModule,
    UserModule,
    AreaModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
