import { Provider, SkipSelf, Optional, InjectionToken } from '@angular/core';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpInterceptorService, RESTService } from '@covalent/http-deprec';
import { MOCK_API } from '../../../config/api.config';

export interface INews {
  id: string;
  title: string;
  by: string;
  email: string;
  created: Date;
  description: string;
}

export class NewsService extends RESTService<INews> {

  constructor(private _http: HttpInterceptorService, api: string) {
    super(_http, {
      baseUrl: MOCK_API,
      path: '/news',
    });
  }

  staticQuery(): Observable<INews[]> {
    return this._http.get('data/news.json')
      .pipe(
        map((res: Response) => {
          return res.json();
        }),
      );
  }

  inMemorydelete(id: string): string {
    let status: string = '';
    return status;
  }

}

export const NEWS_API: InjectionToken<string> = new InjectionToken<string>('NEWS_API');

export function NEWS_PROVIDER_FACTORY(
  parent: NewsService, interceptorHttp: HttpInterceptorService, api: string): NewsService {
  return parent || new NewsService(interceptorHttp, api);
}

export const NEWS_PROVIDER: Provider = {
  // If there is already a service available, use that. Otherwise, provide a new one.
  provide: NewsService,
  deps: [[new Optional(), new SkipSelf(), NewsService], HttpInterceptorService, NEWS_API],
  useFactory: NEWS_PROVIDER_FACTORY,
};
