import { Controller, Get, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TenantInterceptor } from '../../common/interceptors/tenant.interceptor';

@Controller('dashboard')
@UseInterceptors(TenantInterceptor)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  async getStats(@Req() req: any): Promise<any> {
    const companyId = req.user.companyId;
    return this.dashboardService.getStats(companyId);
  }
}
