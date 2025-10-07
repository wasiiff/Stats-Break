/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ConversationDocument = Conversation & Document;

@Schema({ timestamps: true })
export class Message {
  @Prop({ required: true }) role: 'user' | 'assistant';
  @Prop({ required: true }) text: string;
  @Prop({ type: [String], default: [] }) columns?: string[];
  @Prop({ type: [[String]], default: [] }) rows?: string[][];
  @Prop({ default: () => new Date() }) timestamp?: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

@Schema({ timestamps: true })
export class Conversation {
  @Prop({ required: true }) userId: string;

  @Prop({ required: true }) title: string;

  @Prop({ type: [MessageSchema], default: [] })
  messages: Message[];

  @Prop() contextSummary?: string;

  @Prop({ default: () => new Date() }) updatedAt?: Date;
}


export const ConversationSchema = SchemaFactory.createForClass(Conversation);
