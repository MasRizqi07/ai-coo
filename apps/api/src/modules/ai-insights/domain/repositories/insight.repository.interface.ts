import { InsightPayload } from '../../application/use-cases/generate-insights.use-case';

export interface IInsightRepository {
  /**
   * Saves a generated insight.
   */
  save(companyId: string, payload: InsightPayload, type: string): Promise<void>;

  /**
   * Retrieves the latest insight for a company.
   */
  findLatest(companyId: string): Promise<InsightPayload | null>;
}

export const INSIGHT_REPOSITORY = Symbol('INSIGHT_REPOSITORY');
