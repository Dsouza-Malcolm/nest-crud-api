import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import type { Request, Response } from 'express';
import { ErrorResponse } from '../../core/types/error.types';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();

    const req = ctx.getRequest<Request>();

    const res = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string | string[] = 'Internal server error';

    let code = 'INTERNAL_SERVER_ERROR';

    if (exception instanceof HttpException) {
      status = exception.getStatus();

      const response = exception.getResponse();

      if (typeof response === 'string') {
        message = response;
      }

      if (typeof response === 'object') {
        const payload = response as {
          message?: string | string[];
          code?: string;
        };

        message = payload.message ?? exception.message;

        code = payload.code ?? this.defaultCode(status);
      }
    }

    const body: ErrorResponse = {
      success: false,
      statusCode: status,
      code,
      message,
      path: req.originalUrl,
      timestamp: new Date().toISOString(),
    };

    res.status(status).json(body);
  }

  private defaultCode(status: number): string {
    const map: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      500: 'INTERNAL_SERVER_ERROR',
    };

    return map[status] ?? 'HTTP_ERROR';
  }
}
