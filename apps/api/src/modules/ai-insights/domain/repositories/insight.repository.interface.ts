export interface IInsightRepository {
  /**
   * Saves a generated insight.
   */
  save(companyId: string, payload: any, type: string): Promise<void>;

  /**
   * Retrieves the latest insight for a company.
   */
  findLatest(companyId: string): Promise<any | null>;
}

export const INSIGHT_REPOSITORY = Symbol('INSIGHT_REPOSITORY');
