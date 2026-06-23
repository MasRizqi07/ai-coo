import { Controller, Get, UseGuards, UseInterceptors, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { TenantInterceptor } from '../../../../common/interceptors/tenant.interceptor';
import { GenerateInsightsUseCase } from '../../application/use-cases/generate-insights.use-case';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('AI Insights')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(TenantInterceptor)
@Controller('ai-insights')
export class AiInsightsController {
  constructor(private readonly generateInsightsUseCase: GenerateInsightsUseCase) {}

  @Get('latest')
  @ApiOperation({ summary: 'Get the latest AI Operations Insight' })
  @ApiResponse({ status: 200, description: 'AI Insight retrieved successfully.' })
  async getLatest(@Req() req: any): Promise<any> {
    return this.generateInsightsUseCase.execute(req.user.companyId);
  }
}
