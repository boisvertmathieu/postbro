import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpCallerService {

  constructor(private http:HttpClient) { }

  getApiResult(request:HttpRequest<any>):Observable<any>{
    return this.http.request(request);
  }
}
