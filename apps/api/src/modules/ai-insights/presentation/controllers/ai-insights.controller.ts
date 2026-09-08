import { Controller, Get, UseInterceptors, Req } from '@nestjs/common';
import { TenantInterceptor } from '../../../../common/interceptors/tenant.interceptor';
import { GenerateInsightsUseCase } from '../../application/use-cases/generate-insights.use-case';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthenticatedRequest } from '../../../../common/types/authenticated-request.interface';

@ApiTags('AI Insights')
@ApiBearerAuth()
@UseInterceptors(TenantInterceptor)
@Controller('ai-insights')
export class AiInsightsController {
  constructor(private readonly generateInsightsUseCase: GenerateInsightsUseCase) {}

  @Get('latest')
  @ApiOperation({ summary: 'Get the latest AI Operations Insight' })
  @ApiResponse({ status: 200, description: 'AI Insight retrieved successfully.' })
  async getLatest(@Req() req: AuthenticatedRequest): Promise<any> {
    return this.generateInsightsUseCase.execute(req.user.companyId);
  }
}
