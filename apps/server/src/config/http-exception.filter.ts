import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { Request, Response } from 'express'
import { getStatusMessage } from './status'

/**
 * 通用HTTP异常过滤器
 *
 * 为所有抛出的异常提供一致的响应格式:
 * {
 *   status: number,
 *   message: string,
 *   path: string,
 *   timestamp: string,
 *   details?: any
 * }
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name)

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    // 获取HTTP状态码
    const status = exception.getStatus()

    // 获取错误信息
    const exceptionResponse = exception.getResponse()
    let message: string
    let details: any = null

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse
    } else if (typeof exceptionResponse === 'object') {
      message = (exceptionResponse as any)?.message || getStatusMessage(status)

      // 提取验证错误详情
      if (Array.isArray((exceptionResponse as any)?.message)) {
        details = (exceptionResponse as any).message
        message = '请求参数验证失败'
      }
    } else {
      message = getStatusMessage(status)
    }

    // 记录错误日志
    this.logger.error(`HTTP异常 ${status} (${request.method} ${request.url}): ${message}`, exception.stack)

    // 构建标准错误响应
    const errorResponse = {
      status,
      message: message,
      path: request.url,
      timestamp: new Date().toISOString(),
      ...(details && { details }),
    }

    response.status(status).json(errorResponse)
  }
}

/**
 * 全局异常过滤器
 * 处理所有未被捕获的异常，确保API返回一致的错误格式
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name)

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    // 确定HTTP状态码
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

    // 获取错误信息
    let message = '服务器内部错误'

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse()
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse
      } else if (typeof exceptionResponse === 'object' && (exceptionResponse as any)?.message) {
        if (Array.isArray((exceptionResponse as any).message)) {
          message = '请求参数验证失败'
        } else {
          message = (exceptionResponse as any).message
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message || '服务器内部错误'
    }

    // 记录错误日志
    this.logger.error(`未捕获异常 ${status} (${request.method} ${request.url}): ${message}`, exception.stack)

    // 构建标准错误响应
    const errorResponse = {
      status: status,
      message: message,
      path: request.url,
      timestamp: new Date().toISOString(),
    }

    response.status(status).json(errorResponse)
  }
}
