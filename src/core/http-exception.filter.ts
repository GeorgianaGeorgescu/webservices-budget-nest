import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    
    let responseBody = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: exception.message,
    };

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'object' && exceptionResponse['message']) {
        responseBody.message = exceptionResponse['message']; 
      }
    }

    response.status(status).json(responseBody);
  }
}
