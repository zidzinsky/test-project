import { HttpService, Injectable, HttpException } from '@nestjs/common';
import { RestVerbEnum } from './rest-verb.enum';
import { map } from 'rxjs/operators';
import { RequestParams } from './request-params';

@Injectable()
export class RequestService {
  constructor(private httpService: HttpService) {}

  private async sendHttpService(requestParams: RequestParams): Promise<any> {
    let request;

    const { restVerb = RestVerbEnum.Get, headers = {} } = requestParams;

    switch (restVerb) {
      case RestVerbEnum.Get:
        request = this.httpService
          .get(requestParams.url, {
            headers: headers,
          })
          .pipe(map((response) => response.data))
          .toPromise();
        break;
      case RestVerbEnum.Post:
        request = this.httpService
          .post(requestParams.url, requestParams.data, {
            headers: headers,
          })
          .pipe(map((response) => response.data))
          .toPromise();
        break;
      case RestVerbEnum.Put:
        request = this.httpService
          .put(requestParams.url, requestParams.data, {
            headers: headers,
          })
          .pipe(map((response) => response.data))
          .toPromise();
        break;
      case RestVerbEnum.Delete:
        request = this.httpService
          .delete(requestParams.url, {
            headers: headers,
          })
          .pipe(map((response) => response.data))
          .toPromise();
        break;
    }

    try {
      const response = await request;
      return response;
    } catch (error) {
      const status: number = error?.response?.status;
      const message = error?.response?.data || error;

      throw new HttpException(message, status || 500);
    }
  }
}
