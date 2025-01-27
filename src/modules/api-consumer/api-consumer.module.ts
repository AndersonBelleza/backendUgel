import { Module } from '@nestjs/common';
import { ApiConsumerService } from './api-consumer.service';
import { ApiConsumerController } from './api-consumer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiConsumer, ApiConsumerSchema } from './api-consumer.schema';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [MongooseModule.forFeature([
    {
      name: ApiConsumer.name,
      schema: ApiConsumerSchema,
    },
    
  ]),HttpModule],
  controllers: [ApiConsumerController],
  providers: [ApiConsumerService],
})
export class ApiConsumerModule {}
