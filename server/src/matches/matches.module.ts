/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Match, MatchSchema } from './schemas/match.schema';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { GeminiModule } from '../gemini/gemini.module';
import { ConversationsModule } from '../conversations/conversations.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Match.name, schema: MatchSchema }]),
    GeminiModule,
    ConversationsModule,
  ],
  providers: [MatchesService],
  controllers: [MatchesController],
})
export class MatchesModule {}
