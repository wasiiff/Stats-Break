/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MatchDocument = Match & Document;

@Schema({ timestamps: false })
export class Match {
  @Prop() format?: string;
  @Prop() team: string;
  @Prop() opposition: string;
  @Prop() ground: string;
  @Prop() score: string;
  @Prop() overs: number;
  @Prop() rpo: number;
  @Prop() innings: number;
  @Prop() lead?: string;
  @Prop() result: string;
  @Prop({ type: Date }) startDate: Date;
}
export const MatchSchema = SchemaFactory.createForClass(Match);
