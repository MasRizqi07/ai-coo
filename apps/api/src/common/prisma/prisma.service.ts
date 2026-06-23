import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@ai-coo/database';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  /**
   * Helper to set current tenant (company_id) for RLS.
   * This allows enforcing isolation at the DB layer.
   */
  async setTenant(companyId: string) {
    await this.$executeRaw`SELECT set_config('app.current_tenant_id', ${companyId}, false);`;
  }
}
