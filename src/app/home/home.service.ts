import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private http: HttpClient) {
  }

  sendGetRequest(url: string, queryParams: HttpParams) {
    return this.http.get(url, {params: queryParams});
  }
}
