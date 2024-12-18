import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { ZodError } from 'zod';

@Catch(ZodError, HttpException)
export class ErrorFilters implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const request = host.switchToHttp().getRequest();

    let status = exception instanceof HttpException ? exception.getStatus() : 500;
    let message = exception.message || 'Internal Server Error';

    if (exception instanceof ZodError) {
      const zodErrors = exception.errors

      const simplifiedErrors = zodErrors.map((err: any) => ({
        path: err.path.join(' > '),  
        message: err.message,        
      }));

      message = simplifiedErrors
      status = 400; 
      
      response.status(status).json({
        statusCode: status,
        message: message,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    } else if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json({
        message: exception.message,
        statusCode: exception.getStatus(),
        timestamp: new Date().toISOString(),
        path: request.url,
      })
    } else {
      response.status(exception.getStatus()).json({
        timestamp: new Date().toISOString(),
        errors: exception.message,
      });
    }
  }
}
