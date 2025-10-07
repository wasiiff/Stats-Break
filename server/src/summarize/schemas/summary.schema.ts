/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SummaryDocument = Summary & Document;

@Schema({ timestamps: true })
export class Summary {
  @Prop({ required: true }) userId: string;
  @Prop({ required: true }) summary: string;
  @Prop({ default: () => new Date() }) updatedAt?: Date;
}

export const SummarySchema = SchemaFactory.createForClass(Summary);
