import { PartialType } from '@nestjs/mapped-types';
import { CreateApiConsumerDto } from './create-api-consumer.dto';

export class UpdateApiConsumerDto extends PartialType(CreateApiConsumerDto) {}
