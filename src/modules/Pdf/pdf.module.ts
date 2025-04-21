import { Module } from '@nestjs/common';
import { PdfController } from './pdf.controller';
import { HttpModule } from '@nestjs/axios'
import { MongooseModule } from '@nestjs/mongoose';
import { TakModule } from '../Tak/tak.module';

@Module({
  imports: [
    MongooseModule.forFeature([

  ]),
    HttpModule,
    TakModule
  ],
  controllers: [ PdfController ],
})

export class PdfModule {}
