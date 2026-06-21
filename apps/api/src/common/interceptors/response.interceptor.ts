import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Standard success response envelope (spec §10.1):
 * { data: T, meta?: { nextCursor, total } }
 *
 * Controllers return raw data; this interceptor wraps it.
 * If the controller already returns { data }, it passes through unchanged.
 */
interface EnvelopedResponse<T> {
  data: T;
  meta?: Record<string, unknown>;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, EnvelopedResponse<T>> {
  intercept(
    _context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<EnvelopedResponse<T>> {
    return next.handle().pipe(
      map((responseData) => {
        // If already enveloped (has 'data' key), pass through
        if (
          responseData !== null &&
          typeof responseData === 'object' &&
          'data' in (responseData as Record<string, unknown>)
        ) {
          return responseData as unknown as EnvelopedResponse<T>;
        }

        // Wrap raw response in envelope
        return { data: responseData };
      }),
    );
  }
}
