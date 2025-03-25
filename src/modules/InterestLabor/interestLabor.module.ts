import { Module } from '@nestjs/common';
import { InterestLaborService } from './interestLabor.service';
import { InterestLaborController } from './interestLabor.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { InterestLabor, InterestLaborSchema } from './interestLabor.schema';

@Module({
  imports: [MongooseModule.forFeature([
    {
      name: InterestLabor.name,
      schema: InterestLaborSchema,
    }
  ])],
  controllers: [ InterestLaborController ],
  providers: [ InterestLaborService ],
  exports: [ InterestLaborService ]
})

export class InterestLaborModule {}
