import pino from 'pino';

export interface LogContext {
  correlationId?: string;
  [key: string]: unknown;
}

const isProduction = process.env.NODE_ENV === 'production';

export const baseLogger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => ({ level: label.toUpperCase() }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  transport: !isProduction
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      }
    : undefined,
});

export class Logger {
  private context: LogContext = {};

  constructor(context?: LogContext) {
    if (context) {
      this.context = context;
    }
  }

  public child(context: LogContext): Logger {
    return new Logger({ ...this.context, ...context });
  }

  private formatPayload(msg: string, metadata?: Record<string, unknown>) {
    return {
      message: msg,
      ...this.context,
      ...metadata,
    };
  }

  public info(msg: string, metadata?: Record<string, unknown>) {
    baseLogger.info(this.formatPayload(msg, metadata));
  }

  public error(
    msg: string,
    err?: Error | unknown,
    metadata?: Record<string, unknown>
  ) {
    baseLogger.error({
      ...this.formatPayload(msg, metadata),
      error:
        err instanceof Error
          ? {
              name: err.name,
              message: err.message,
              stack: err.stack,
            }
          : err,
    });
  }

  public warn(msg: string, metadata?: Record<string, unknown>) {
    baseLogger.warn(this.formatPayload(msg, metadata));
  }

  public debug(msg: string, metadata?: Record<string, unknown>) {
    baseLogger.debug(this.formatPayload(msg, metadata));
  }

  public fatal(
    msg: string,
    err?: Error | unknown,
    metadata?: Record<string, unknown>
  ) {
    baseLogger.fatal({
      ...this.formatPayload(msg, metadata),
      error:
        err instanceof Error
          ? {
              name: err.name,
              message: err.message,
              stack: err.stack,
            }
          : err,
    });
  }
}

export const logger = new Logger();
export default logger;
