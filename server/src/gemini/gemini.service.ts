/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';
import {
  GoogleGenerativeAI,
  GenerateContentResult,
} from '@google/generative-ai';

config();

@Injectable()
export class GeminiService {
  private client: GoogleGenerativeAI;
  private model: string;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || '';
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not found in .env');
    }

    this.client = new GoogleGenerativeAI(apiKey);
    this.model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  }

  async ask(prompt: string): Promise<string> {
    try {
      const model = this.client.getGenerativeModel({ model: this.model });
      const result: GenerateContentResult = await model.generateContent(prompt);
      return result.response.text();
    } catch (err: any) {
      console.error('Gemini API error:', err.message);
      throw err;
    }
  }
}