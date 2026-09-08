import { Controller, Get, Patch, Body, Req, UseInterceptors } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { UpdateCompanyDto } from '@ai-coo/shared-types';
import { TenantInterceptor } from '../../common/interceptors/tenant.interceptor';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthenticatedRequest } from '../../common/types/authenticated-request.interface';

@ApiTags('Companies')
@ApiBearerAuth()
@UseInterceptors(TenantInterceptor)
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get current company profile and business settings' })
  async getProfile(@Req() req: AuthenticatedRequest) {
    return this.companiesService.getProfile(req.user.companyId);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update company profile settings' })
  async updateProfile(@Req() req: AuthenticatedRequest, @Body() dto: UpdateCompanyDto) {
    return this.companiesService.updateProfile(req.user.companyId, dto);
  }
}
