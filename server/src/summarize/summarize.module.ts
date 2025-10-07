/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Summary, SummarySchema } from './schemas/summary.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Summary.name, schema: SummarySchema }])],
  exports: [MongooseModule],
})
export class SummariesModule {}
