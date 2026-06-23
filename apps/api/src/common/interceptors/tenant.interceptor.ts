import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import { TenantContext } from '../context/tenant-context';

/**
 * Interceptor that sets the PostgreSQL Row-Level Security tenant context
 * based on the authenticated user's JWT payload.
 * Must be used AFTER JwtAuthGuard.
 */
@Injectable()
export class TenantInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.companyId) {
      throw new UnauthorizedException('User context or company ID missing from request');
    }

    // Set the tenant in the database session for RLS
    await this.prisma.setTenant(user.companyId);

    // Wrap the handler execution in the TenantContext async local storage
    return new Observable((subscriber) => {
      TenantContext.run(user.companyId, () => {
        const subscription = next.handle().subscribe({
          next: (val) => subscriber.next(val),
          error: (err) => subscriber.error(err),
          complete: () => subscriber.complete(),
        });
        return () => subscription.unsubscribe();
      });
    });
  }
}
