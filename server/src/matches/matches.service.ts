/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { Match, MatchDocument } from './schemas/match.schema';
import { GeminiService } from '../gemini/gemini.service';
import { ConversationsService } from '../conversations/conversations.service';

@Injectable()
export class MatchesService {
  private readonly logger = new Logger(MatchesService.name);

  constructor(
    @InjectModel(Match.name) private matchModel: Model<MatchDocument>,
    private readonly gemini: GeminiService,
    @InjectConnection() private readonly connection: Connection,
    private readonly convService: ConversationsService,
  ) {}

  // ---------- Node 1: Relevancy Checker ----------
  async relevancyCheck(question: string): Promise<boolean> {
    const prompt = `
Decide if the following user question is about cricket matches, players, or cricket statistics.
Return only "true" or "false".

Question: "${question}"
    `.trim();

    try {
      const resp = await this.gemini.ask(prompt);
      return resp.toLowerCase().includes('true');
    } catch (err) {
      this.logger.error('Gemini relevancy check failed, defaulting to false', err);
      return false;
    }
  }

  // ---------- Detect match format ----------
  detectFormat(question: string): 'test' | 'odi' | 't20' | null {
    const q = question.toLowerCase();
    if (q.includes('test')) return 'test';
    if (q.includes('odi')) return 'odi';
    if (q.includes('t20') || q.includes('t 20') || q.includes('twenty20')) return 't20';
    return null;
  }

  // ---------- Node 2: Memory Retriever (per conversation) ----------
  async retrieveMemory(userId: string, conversationId: string): Promise<string | null> {
    try {
      const summary = await this.convService.getSummary(userId, conversationId);
      if (summary) return summary;

      const conv = await this.convService.getConversation(userId, conversationId);
      if (!conv || !conv.messages || conv.messages.length === 0) return null;

      const messages = conv.messages;
      const text = messages
        .map((m) => `${m.role === 'user' ? 'Q' : 'A'}: ${m.text}`)
        .join('\n---\n');

      if (messages.length > 6) {
        const prompt = `
Summarize the following recent conversation into 3 concise facts that are relevant for answering future cricket questions:
${text}
Return only the short summary lines.
        `.trim();
        try {
          return (await this.gemini.ask(prompt)).trim();
        } catch (err) {
          this.logger.warn('Gemini summarizer failed, using raw history', err);
          return text;
        }
      }
      return text;
    } catch (err) {
      this.logger.error('Memory retrieval failed', err);
      return null;
    }
  }

  // ---------- Node 3: Query Generator (now accepts memory) ----------
  async generateMongoQuery(
    question: string,
    formatHint?: string,
    memory?: string,
  ) {
    const schema = {
      collections: ['test', 'odi', 't20'],
      fields: {
        Format: 'string (test|odi|t20)',
        Team: 'string',
        Opposition: 'string',
        Ground: 'string',
        Score: "string like '250/8'",
        Overs: 'number',
        RPO: 'number',
        Inns: 'number',
        Lead: 'string',
        Result: "string like 'Won by 30 runs'",
        StartDate: 'ISO date',
      },
    };

    const prompt = `
# CRICKET MONGODB QUERY GENERATOR
    Pre Task Instructions:
    Normalize the text if it has any typos or grammatical errors.

    You are an assistant that will convert user question into mongoDB Query here are the Detailed Task Instructions 

## SCHEMA
${JSON.stringify(schema, null, 2)}

## TASK
Convert user question into a MongoDB query.  
Return ONLY valid JSON in this format:
\`\`\`json
{
  "collection": "test|odi|t20|all",
  "filter": {},
  "projection": {},
  "sort": {},
  "limit": number,
  "agg": []
}
\`\`\`

## RULES
- Match format → detect keywords ("test", "odi", "t20") else use formatHint or "all".
- Team/venue → case-insensitive regex.
- Dates → use startDate with $gte/$lte.
- Scores → always wrap in $convert with onError:null, onNull:null.
- Results → regex.
- Rankings ("highest", "top") → sort desc + limit.
- Recent/oldest → sort by startDate desc/asc + limit.
- Head-to-head → $or with both team/opposition pairs.
- Aggregations allowed in "agg".
- If unclear → default: collection:"all", filter:{}, sort:{startDate:-1}, limit:20.

## MEMORY
${memory ? `User memory/context:\n${memory}` : 'No memory available.'}

## USER QUESTION
"${question}"

Generate only the JSON query.
    `.trim();

    try {
      const resp = await this.gemini.ask(prompt);
      const clean = resp.replace(/```json/i, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(clean);

      // Normalize
      if (!parsed.collection || parsed.collection === '' || parsed.collection === 'all') {
        parsed.collection = formatHint || 'all';
      }
      if (!parsed.filter) parsed.filter = {};
      if (!parsed.limit) parsed.limit = 20;
      if (!parsed.projection) parsed.projection = {};
      if (!parsed.sort) parsed.sort = { startDate: -1 };
      if (!parsed.agg) parsed.agg = [];

      return parsed;
    } catch (err) {
      this.logger.error('Failed to parse Gemini query JSON', err);
      return {
        collection: formatHint || 'all',
        filter: {},
        projection: {},
        sort: { startDate: -1 },
        limit: 20,
        agg: [],
      };
    }
  }

  // ---------- Node 4: Query Executor ----------
  private async executeMongoQuery(genQuery: any) {
    const db = this.connection?.db;
    if (!db) throw new Error('MongoDB connection is not initialized.');

    const results: any[] = [];
    const collections =
      genQuery.collection === 'all' ? ['test', 'odi', 't20'] : [genQuery.collection];

    const applyRegex = (obj: any): any => {
      if (!obj) return obj;
      if (typeof obj === 'string') return { $regex: obj, $options: 'i' };
      if (Array.isArray(obj)) return obj.map(applyRegex);
      if (typeof obj === 'object' && obj !== null) {
        const newObj: any = {};
        for (const [k, v] of Object.entries(obj)) {
          if (k.startsWith('$')) {
            newObj[k] = v;
          } else if (typeof v === 'string') {
            newObj[k] = { $regex: v, $options: 'i' };
          } else {
            newObj[k] = applyRegex(v);
          }
        }
        return newObj;
      }
      return obj;
    };

    for (const col of collections) {
      const collection = db.collection(col);

      // Aggregation pipeline
      if (genQuery.agg && Array.isArray(genQuery.agg) && genQuery.agg.length > 0) {
        const pipeline = [{ $match: applyRegex(genQuery.filter) }, ...genQuery.agg];
        const docs = await collection.aggregate(pipeline).toArray();
        results.push(...docs.map((d) => ({ ...d, format: col })));
        continue;
      }

      // Expression-based sort
      const hasExprSort =
        genQuery.sort && Object.values(genQuery.sort).some((v) => typeof v === 'object');
      if (hasExprSort) {
        const pipeline: any[] = [];
        if (genQuery.filter && Object.keys(genQuery.filter).length > 0) {
          pipeline.push({ $match: applyRegex(genQuery.filter) });
        }
        pipeline.push({ $addFields: { sortKey: genQuery.sort } });
        pipeline.push({ $sort: { sortKey: -1 } });
        if (genQuery.limit) pipeline.push({ $limit: genQuery.limit });
        if (genQuery.projection && Object.keys(genQuery.projection).length > 0) {
          pipeline.push({ $project: genQuery.projection });
        }
        const docs = await collection.aggregate(pipeline).toArray();
        results.push(...docs.map((d) => ({ ...d, format: col })));
        continue;
      }

      // Standard find query
      const cursor = collection.find(applyRegex(genQuery.filter || {}));
      if (genQuery.projection && Object.keys(genQuery.projection).length > 0) {
        cursor.project(genQuery.projection);
      }
      if (genQuery.sort) cursor.sort(genQuery.sort);
      if (genQuery.limit) cursor.limit(genQuery.limit);
      const docs = await cursor.toArray();
      results.push(...docs.map((d) => ({ ...d, format: col })));
    }

    return results;
  }

  // ---------- Node 5: Answer Formatter ----------
  async formatAnswer(
    question: string,
    rawResults: any[],
  ): Promise<{ type: 'text' | 'table'; text?: string; columns?: string[]; rows?: any[][] }> {
    if (!rawResults || rawResults.length === 0) {
      return { type: 'text', text: 'No matching records found.' };
    }

    if (rawResults.length === 1) {
      const doc = rawResults[0];
      const prompt = `
Question: "${question}"
Document: ${JSON.stringify(doc)}
Produce a concise one-line human-friendly answer.
Format example:
"Australia vs England at MCG on 2022-01-05 — 250/8 (50 overs), Result: Won by 30 runs"
Return only plain text.
      `.trim();
      const resp = await this.gemini.ask(prompt);
      return { type: 'text', text: resp.trim() };
    }

    const keys = new Set<string>();
    rawResults.forEach((r) => Object.keys(r).forEach((k) => keys.add(k)));
    const prefer = [
      'startDate',
      'team',
      'opposition',
      'ground',
      'score',
      'overs',
      'rpo',
      'innings',
      'lead',
      'result',
      'format',
    ];
    const columns = prefer
      .filter((p) => keys.has(p))
      .concat([...keys].filter((k) => !prefer.includes(k)));

    const rows = rawResults.map((r) =>
      columns.map((c) => {
        if (r[c] === undefined || r[c] === null) return '';
        if (c === 'startDate') {
          try {
            return new Date(r[c]).toISOString().split('T')[0];
          } catch {
            return String(r[c]);
          }
        }
        return typeof r[c] === 'object' ? JSON.stringify(r[c]) : String(r[c]);
      }),
    );

    const summaryPrompt = `
User question: "${question}"
Sample rows: ${JSON.stringify(rawResults.slice(0, 5))}
Write a 2–3 sentence summary describing the main findings in human-readable form.
No markdown, no tables, just plain text.
    `.trim();

    const summary = await this.gemini.ask(summaryPrompt);
    return { type: 'table', columns, rows, text: summary.trim() };
  }

  // ---------- Node 6 & 7: Full workflow ----------
  async answerQuestion(
    question: string,
    userId: string,
    conversationId?: string,
    formatHint?: string,
  ) {
    const relevant = await this.relevancyCheck(question);
    if (!relevant) {
      return {
        type: 'text',
        text: 'Sorry, I can only answer cricket-related questions.',
      };
    }

    // 🔹 Use or create conversation
    let convId = conversationId;
    if (!convId) {
      const conv = await this.convService.createConversation(userId, question);
      convId = (conv._id as Types.ObjectId).toString();
    } else {
      await this.convService.addMessage(userId, convId, 'user', question);
    }

    // 🔹 Memory retrieval
    const memory = await this.retrieveMemory(userId, convId);

    const detectedFormat = this.detectFormat(question) || formatHint;
    const genQuery = await this.generateMongoQuery(
      question,
      detectedFormat || undefined,
      memory || undefined,
    );
    this.logger.debug('Generated query: ' + JSON.stringify(genQuery));

    const results = await this.executeMongoQuery(genQuery);
    const answer = await this.formatAnswer(question, results);

    // 🔹 Save assistant’s answer
    try {
      if (answer.type === 'text') {
        await this.convService.addMessage(userId, convId, 'assistant', answer.text ?? 'No answer');
      } else {
        await this.convService.addMessage(
          userId,
          convId,
          'assistant',
          answer.text ?? 'Table response',
          answer.columns,
          answer.rows,
        );
      }
    } catch (err) {
      this.logger.error('Failed to save conversation', err);
    }

    // 🔹 Return answer + memory trace
    const summary = await this.convService.getSummary(userId, convId);
    return { ...answer, memorySummary: summary || memory || null, conversationId: convId };
  }
}
