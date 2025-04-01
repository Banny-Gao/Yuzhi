import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpStatus } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        // If data is already formatted (has code, data, message properties), return as is
        if (data && data.code && data.hasOwnProperty('data') && data.message) {
          return data
        }

        // Format response data
        return {
          code: HttpStatus.OK,
          data: data === null || data === undefined ? null : data,
          message: 'Success',
        }
      })
    )
  }
}
