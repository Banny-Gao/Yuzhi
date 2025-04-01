import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common'
import { Request, Response } from 'express'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const status = exception.getStatus()

    // Get the exception response
    const exceptionResponse = exception.getResponse() as any

    // Format the error response
    const errorResponse = {
      code: status,
      message: exceptionResponse.message || exception.message,
      path: request.url,
      timestamp: new Date().toISOString(),
    }

    // Send the response
    response.status(status).json(errorResponse)
  }
}
