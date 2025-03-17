import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { StatusTypeModule } from '../statusType/statusType.module';
import { JwtModule } from '@nestjs/jwt';
import { TOKEN_SECRET } from 'src/config';
import { PersonModule } from '../Person/person.module';
import { AreaModule } from '../Area/area.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      }
    ]),
    StatusTypeModule,
    PersonModule,
    AreaModule,
    JwtModule.register({
      global: true,
      secret: TOKEN_SECRET,
      signOptions: { expiresIn: "1D"},
    }),
  ],
  controllers: [ UserController ],
  providers: [ UserService ],
  exports: [ UserService ]

})
export class UserModule {}
