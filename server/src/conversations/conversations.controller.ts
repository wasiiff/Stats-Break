/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('conversations')
@UseGuards(AuthGuard('jwt'))
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  /**
   * Create a new conversation (with first user message).
   */
  @Post()
  async createConversation(
    @Req() req,
    @Body('text') text: string,
  ) {
    return this.conversationsService.createConversation(req.user.sub, text);
  }

  /**
   * Add a message to an existing conversation.
   */
  @Post(':conversationId/messages')
  async addMessage(
    @Req() req,
    @Param('conversationId') conversationId: string,
    @Body('role') role: 'user' | 'assistant',
    @Body('text') text: string,
    @Body('columns') columns?: string[],
    @Body('rows') rows?: string[][],
  ) {
    return this.conversationsService.addMessage(
      req.user.sub,
      conversationId,
      role,
      text,
      columns,
      rows,
    );
  }

  /**
   * List recent conversations (summary view).
   */
  @Get()
  async listConversations(@Req() req, @Query('limit') limit?: number) {
    return this.conversationsService.listConversations(req.user.sub, limit);
  }

  /**
   * Get full conversation by ID (with all messages).
   */
  @Get(':conversationId')
  async getConversation(
    @Req() req,
    @Param('conversationId') conversationId: string,
  ) {
    return this.conversationsService.getConversation(req.user.sub, conversationId);
  }
}
