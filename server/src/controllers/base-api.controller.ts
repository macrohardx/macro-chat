import { BaseHttpController } from 'inversify-express-utils';
import { FileResultOptions } from '../utils/file-result-options';
import { noop, cacheForDuration } from '../utils/http-helpers';
import config from '../config';
import * as HttpStatusCode from 'http-status-codes';

export abstract class BaseApiController extends BaseHttpController {

  protected statusCodes = HttpStatusCode;

  protected cacheResponse(duration: string): void {
    this.httpContext.response.set(cacheForDuration('10m'))
  }

  protected file(filePath: string, options?: FileResultOptions): Function {
    this.httpContext.response.sendFile(filePath, options);
    //inversify-express-utils doesn't tamper with the response body/statusCode if it's return type is Function
    return noop;
  }

  protected get userId(): any {
    return this.httpContext.request.headers[config.user_id_cookie];
  }
}