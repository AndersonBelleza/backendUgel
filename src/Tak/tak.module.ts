import { Module } from '@nestjs/common';
import { TakService } from './tak.service';
import { TakController } from './tak.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tak, TakSchema } from './tak.schema';
import { UserModule } from 'src/User/user.module';
import { StatusTypeModule } from 'src/statusType/statusType.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Tak.name,
        schema: TakSchema,
      }
    ]),
    UserModule,
    StatusTypeModule
  ],
  controllers: [ TakController ],
  providers: [ TakService ],
})
export class TakModule {}
