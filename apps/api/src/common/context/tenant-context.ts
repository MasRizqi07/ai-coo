import { AsyncLocalStorage } from 'async_hooks';

export class TenantContext {
  private static storage = new AsyncLocalStorage<string>();

  /**
   * Run a function within a tenant context.
   */
  static run<T>(companyId: string, fn: () => T): T {
    return this.storage.run(companyId, fn);
  }

  /**
   * Retrieve the current company ID from the async storage context.
   */
  static getCompanyId(): string | undefined {
    return this.storage.getStore();
  }
}
