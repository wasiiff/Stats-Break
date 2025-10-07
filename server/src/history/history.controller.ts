/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Get, UseGuards, Param, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConversationsService } from '../conversations/conversations.service';

@Controller('user')
export class HistoryController {
  constructor(private readonly convService: ConversationsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('history/:userId')
  async getHistory(@Param('userId') userId: string, @Request() req: any) {
    // Normalize user id from token (support sub or userId)
    const requesterId = req.user?.userId ?? req.user?.sub;
    const targetUserId = !userId || userId === 'undefined' ? requesterId : userId;

    if (!requesterId) return { error: 'unauthenticated' };
    if (requesterId !== targetUserId) return { error: 'forbidden' };

    // ✅ use new method
    const conversations = await this.convService.getUserConversations(targetUserId, 20);
    return { conversations };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('summary/:conversationId')
  async getSummary(@Param('conversationId') conversationId: string, @Request() req: any) {
    const requesterId = req.user?.userId ?? req.user?.sub;

    if (!requesterId) return { error: 'unauthenticated' };

    // ✅ new method requires both userId + conversationId
    const summary = await this.convService.getSummary(requesterId, conversationId);
    return { summary };
  }
}
