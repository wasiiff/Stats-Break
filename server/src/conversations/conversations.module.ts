/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Conversation, ConversationSchema } from './schemas/converstion.schema';
import { Summary, SummarySchema } from '../summarize/schemas/summary.schema';
import { ConversationsService } from './conversations.service';
import { GeminiModule } from '../gemini/gemini.module';
import { SummariesModule } from '../summarize/summarize.module';
import { ConversationsController } from './conversations.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
      { name: Summary.name, schema: SummarySchema },
    ]),
    GeminiModule,
    SummariesModule,
  ],
  controllers: [ConversationsController],
  providers: [ConversationsService],
  exports: [ConversationsService],
})
export class ConversationsModule {}
