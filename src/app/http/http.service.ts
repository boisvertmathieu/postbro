import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface Request {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: { [key: string]: string };
  queryParams?: { [key: string]: string | number | boolean };
  body?: any;
}

export interface Response {
  status: number;
  body: any;
}

export function isHttpResponse(obj: any): obj is Response {
  return typeof obj === 'object' && obj !== null &&
    'status' in obj && typeof obj.status === 'number' &&
    'body' in obj;
}

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) {
  }

  sendRequest(request: Request): Observable<unknown> {
    const headers = new HttpHeaders(request.headers);
    const params = new HttpParams({fromObject: request.queryParams});
    const options = {
      headers,
      params,
      observe: 'response' as const
    }

    switch (request.method) {
      case 'GET':
        return this.http.get(request.url, options);
      case 'POST':
        return this.http.post(request.url, request.body, options);
      case 'PUT':
        return this.http.put(request.url, request.body, options);
      case 'DELETE':
        return this.http.delete(request.url, options);
      case 'PATCH':
        return this.http.patch(request.url, request.body, options);
      default:
        throw new Error(`Méthode HTTP non prise en charge : ${String(request.method)}`);
    }
  }
}
