/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Conversation, ConversationDocument } from './schemas/converstion.schema';
import { GeminiService } from '../gemini/gemini.service';

@Injectable()
export class ConversationsService {
  private readonly logger = new Logger(ConversationsService.name);
  private MAX_ITEMS = Number(process.env.MAX_CONVERSATION_ITEMS || 50);
  private SUMMARY_THRESHOLD = Number(process.env.SUMMARY_THRESHOLD || 30);

  constructor(
    @InjectModel(Conversation.name) private convModel: Model<ConversationDocument>,
    private readonly gemini: GeminiService,
  ) {}

  /**
   * Create a new conversation with the first user message.
   */
  async createConversation(userId: string, firstMessage: string) {
    const conv = new this.convModel({
      userId,
      title: firstMessage.slice(0, 50) || 'New Conversation',
      messages: [{ role: 'user', text: firstMessage, timestamp: new Date() }],
      updatedAt: new Date(),
    });
    await conv.save();
    return conv;
  }

  /**
   * Add a new message to an existing conversation.
   */
  async addMessage(
    userId: string,
    conversationId: string,
    role: 'user' | 'assistant',
    text: string,
    columns?: string[],
    rows?: string[][],
  ) {
    const conv = await this.convModel.findOne({
      _id: new Types.ObjectId(conversationId),
      userId,
    });

    if (!conv) {
      throw new Error('Conversation not found');
    }

    conv.messages.push({ role, text, columns, rows, timestamp: new Date() });
    conv.updatedAt = new Date();
    await conv.save();

    await this.maybeSummarize(conv);
    return conv;
  }

  /**
   * Summarize the conversation if it has enough messages.
   */
  private async maybeSummarize(conv: ConversationDocument) {
    if (!conv.messages || conv.messages.length < this.SUMMARY_THRESHOLD) {
      return;
    }

    const items = conv.messages.slice(-this.SUMMARY_THRESHOLD);
    const blob = items
      .map((m) => `${m.role === 'user' ? 'Q' : 'A'}: ${m.text}`)
      .join('\n---\n');

    const prompt = `
Summarize the following conversation into 4–6 very short bullet points of key facts and preferences.
Conversation:
${blob}

Return only the short summary text.
    `.trim();

    try {
      const summaryText = (await this.gemini.ask(prompt)).trim();
      conv.contextSummary = summaryText;
      await conv.save();

      // prune old conversations (keep only MAX_ITEMS per user)
      const docs = await this.convModel
        .find({ userId: conv.userId })
        .sort({ updatedAt: -1 })
        .limit(this.MAX_ITEMS)
        .select('_id')
        .lean()
        .exec();

      const idsToKeep = docs.map((d) => d._id);
      await this.convModel.deleteMany({
        userId: conv.userId,
        _id: { $nin: idsToKeep },
      });
    } catch (err) {
      this.logger.error('Failed to summarize conversation', err);
    }
  }

   /**
   * List conversations for a user (summary view).
   */
  async listConversations(userId: string, limit = 50) {
    return this.convModel
      .find({ userId })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .select('_id title updatedAt contextSummary')
      .lean()
      .exec();
  }

  /**
 * Get a single conversation with all messages.
 */
async getConversation(userId: string, conversationId: string) {
  return this.convModel
    .findOne({
      _id: new Types.ObjectId(conversationId),
      userId,
    })
    .lean()
    .exec();
}


  /**
   * Wrapper for listing user conversations.
   */
  async getUserConversations(userId: string, limit = 50) {
    return this.listConversations(userId, limit);
  }

  /**
   * Get only the stored summary for a conversation.
   */
  async getSummary(userId: string, conversationId: string) {
    const conv = await this.convModel
      .findOne({
        _id: new Types.ObjectId(conversationId),
        userId,
      })
      .select('contextSummary')
      .lean()
      .exec();

    return conv?.contextSummary ?? null;
  }
}
