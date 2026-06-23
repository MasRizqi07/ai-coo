import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';
import { IAIProvider } from '../../domain/services/ai-provider.interface';

@Injectable()
export class OpenAiProvider implements IAIProvider {
  private readonly openai: OpenAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY') || 'sk-fake-key-for-tests';
    this.openai = new OpenAI({ apiKey });
  }

  async generateInsight(prompt: string, schema?: any): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert Chief Operating Officer assistant. Analyze daily metrics and compile JSON operations insights for Indonesian UMKM in Bahasa Indonesia. NEVER invent any entity names or numbers not supplied.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: schema
        ? {
            type: 'json_schema',
            json_schema: {
              name: 'ai_insight',
              strict: true,
              schema,
            },
          }
        : { type: 'json_object' },
    });

    return response.choices[0].message.content || '';
  }
}
