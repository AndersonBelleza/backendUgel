import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthController } from "./auth-user.controller";

import {TOKEN_SECRET} from 'src/config'
import { JwtModule } from '@nestjs/jwt'
import { UserModule } from "../User/user.module";
import { StatusTypeModule } from "../statusType/statusType.module";

@Module({
  imports: [MongooseModule.forFeature([

  ]),
  UserModule,
  StatusTypeModule,
  JwtModule.register({
    global: true,
    secret: TOKEN_SECRET,
    signOptions: { expiresIn: "1D"},
  }),
],
  controllers: [ AuthController ],
  providers: [  ],
  exports: [ ]
})
export class AuthModule {}