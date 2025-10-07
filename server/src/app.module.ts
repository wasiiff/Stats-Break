/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MatchesModule } from './matches/matches.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/user.module';
import { ConversationsModule } from './conversations/conversations.module';
import { HistoryController } from './history/history.controller';
import { GeminiModule } from './gemini/gemini.module';
import { config } from 'dotenv';
config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI! ),
    MatchesModule,
    AuthModule,
    UsersModule,
    ConversationsModule,
    GeminiModule,
  ],
  controllers: [HistoryController],
})
export class AppModule {}
