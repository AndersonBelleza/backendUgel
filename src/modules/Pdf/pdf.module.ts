import { Module } from '@nestjs/common';
import { PdfController } from './pdf.controller';
import { HttpModule } from '@nestjs/axios'
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([

  ]),
  HttpModule
  ],
  controllers: [ PdfController ],
})

export class PdfModule {}
