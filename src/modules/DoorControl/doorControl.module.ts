import { Module } from '@nestjs/common';
import { DoorControlService } from './doorControl.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DoorControl, DoorControlSchema } from './doorControl.schema';
import { StatusTypeModule } from '../statusType/statusType.module';
import { JwtModule } from '@nestjs/jwt';
import { TOKEN_SECRET } from 'src/config';
import { PersonModule } from '../Person/person.module';
import { DoorControlController } from './doorControl.controller';
import { DoorControlDetail, DoorControlDetailSchema } from './doorControlDetail.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DoorControl.name,
        schema: DoorControlSchema,
      }
    ]),
    StatusTypeModule,
    PersonModule,
    JwtModule.register({
      global: true,
      secret: TOKEN_SECRET,
      signOptions: { expiresIn: "1D"},
    }),
  ],
  controllers: [ DoorControlController ],
  providers: [ DoorControlService ],
  exports: [ DoorControlService ]

})
export class DoorControlModule {}
