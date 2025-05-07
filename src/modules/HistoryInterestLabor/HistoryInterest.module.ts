import { Module } from '@nestjs/common';
import { HistoryInterestService } from './HistoryInterest.service';
import { HistoryInterestController } from './HistoryInterest.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { HistoryInterest, HistoryInterestSchema } from './HistoryInterest.schema';

@Module({
  imports: [MongooseModule.forFeature([
    {
      name: HistoryInterest.name,
      schema: HistoryInterestSchema
    }
  ])],
  controllers: [ HistoryInterestController ],
  providers: [ HistoryInterestService ],
  exports: [ HistoryInterestService ]
})

export class HistoryInterestModule {}
