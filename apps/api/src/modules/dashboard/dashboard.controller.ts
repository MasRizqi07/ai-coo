import { Controller, Get, Req, UseInterceptors } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { TenantInterceptor } from '../../common/interceptors/tenant.interceptor';
import { AuthenticatedRequest } from '../../common/types/authenticated-request.interface';

@Controller('dashboard')
@UseInterceptors(TenantInterceptor)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  async getStats(@Req() req: AuthenticatedRequest): Promise<any> {
    const companyId = req.user.companyId;
    return this.dashboardService.getStats(companyId);
  }

  @Get('charts')
  async getCharts(@Req() req: AuthenticatedRequest): Promise<any> {
    const companyId = req.user.companyId;
    return this.dashboardService.getCharts(companyId);
  }
}
