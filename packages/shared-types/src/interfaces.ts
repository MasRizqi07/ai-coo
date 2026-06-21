/**
 * Standard API success response envelope.
 * Every successful response follows this shape (spec §10.1).
 */
export interface ApiResponse<T> {
  data: T;
  meta?: ApiMeta;
}

/**
 * Pagination and metadata for list responses.
 */
export interface ApiMeta {
  /** Cursor for the next page, null if no more pages */
  nextCursor: string | null;
  /** Total count (only included when cheap to compute) */
  total?: number;
}

/**
 * Standard API error response envelope.
 * Every error response follows this shape (spec §10.1).
 */
export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

/**
 * AI Insight action item.
 * Each action must reference a real entity (spec §6.7).
 */
export interface InsightActionItem {
  targetType: 'CUSTOMER' | 'PRODUCT';
  targetName: string;
  action: string;
  reason: string;
}

/**
 * AI Insight payload structure.
 * This is the JSON schema the AI must produce (spec §9.3).
 */
export interface InsightPayload {
  summary: string;
  risks: string[];
  opportunities: string[];
  actionItems: InsightActionItem[];
}
