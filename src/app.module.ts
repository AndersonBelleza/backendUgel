import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiConsumerModule } from './api-consumer/api-consumer.module';
import { TakModule } from './Tak/tak.module';


@Module({
  imports: [
    MongooseModule.forRoot("mongodb+srv://bellezatorresanderson:2yRteAB38FimVOGX@cluster0.mo2lj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"),
    ApiConsumerModule,
    TakModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
