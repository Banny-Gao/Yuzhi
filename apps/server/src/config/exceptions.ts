import { HttpException } from '@nestjs/common'
import { ResponseStatus } from '@workspace/request'

/**
 * 自定义异常基类
 */
export class ApiException extends HttpException {
  constructor(message: string | object, status: number) {
    super(message, status)
  }
}

/**
 * 400 Bad Request - 请求参数错误
 */
export class BadRequestException extends ApiException {
  constructor(message = '请求参数有误') {
    super(message, ResponseStatus.BAD_REQUEST)
  }
}

/**
 * 401 Unauthorized - 未授权异常，通常用于未登录
 */
export class UnauthorizedException extends ApiException {
  constructor(message = '未登录或登录已过期') {
    super(message, ResponseStatus.UNAUTHORIZED)
  }
}

/**
 * 403 Forbidden - 禁止访问，通常用于已登录但权限不足
 */
export class ForbiddenException extends ApiException {
  constructor(message = '无权访问该资源') {
    super(message, ResponseStatus.FORBIDDEN)
  }
}

/**
 * 404 Not Found - 资源不存在
 */
export class NotFoundException extends ApiException {
  constructor(message = '请求的资源不存在') {
    super(message, ResponseStatus.NOT_FOUND)
  }
}

/**
 * 409 Conflict - 资源冲突，通常用于资源已存在
 */
export class ConflictException extends ApiException {
  constructor(message = '资源冲突') {
    super(message, ResponseStatus.CONFLICT)
  }
}

/**
 * 429 Too Many Requests - 请求过多
 */
export class TooManyRequestsException extends ApiException {
  constructor(message = '请求频率过高，请稍后再试') {
    super(message, ResponseStatus.TOO_MANY_REQUESTS)
  }
}

/**
 * 500 Internal Server Error - 服务器内部错误
 */
export class InternalServerErrorException extends ApiException {
  constructor(message = '服务器内部错误') {
    super(message, ResponseStatus.ERROR)
  }
}

/**
 * 503 Service Unavailable - 服务不可用
 */
export class ServiceUnavailableException extends ApiException {
  constructor(message = '服务暂时不可用') {
    super(message, ResponseStatus.SERVICE_UNAVAILABLE)
  }
}

/**
 * 业务错误 - 基于业务逻辑的错误，通常使用400状态码
 */
export class BusinessException extends ApiException {
  constructor(message: string, status = ResponseStatus.BAD_REQUEST) {
    super(message, status)
  }
}

/**
 * 验证错误 - 参数验证失败
 */
export class ValidationException extends ApiException {
  constructor(errors: string[] | string, message = '请求参数验证失败') {
    super(
      {
        message,
        errors: Array.isArray(errors) ? errors : [errors],
      },
      ResponseStatus.BAD_REQUEST
    )
  }
}
