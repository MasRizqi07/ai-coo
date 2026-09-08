export interface IAIProvider {
  /**
   * Generates insight payload using OpenAI.
   */
  generateInsight(prompt: string, schema?: Record<string, unknown>): Promise<string>;
}

export const AI_PROVIDER = Symbol('AI_PROVIDER');
