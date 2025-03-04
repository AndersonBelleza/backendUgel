import { Module } from '@nestjs/common';
import { TypeEquipmentService } from './typeEquipment.service';
import { TypeEquipmentController } from './typeEquipment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeEquipment, TypeEquipmentSchema } from './typeEquipment.schema';

@Module({
  imports: [MongooseModule.forFeature([
    {
      name: TypeEquipment.name,
      schema: TypeEquipmentSchema,
    }
  ])],
  controllers: [ TypeEquipmentController ],
  providers: [ TypeEquipmentService ],
  exports: [ TypeEquipmentService ]
})

export class TypeEquipmentModule {}
