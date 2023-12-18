import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  myForm!: FormGroup;
  httpMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
  responseData: any;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    console.log('HomeComponent INIT');

    this.myForm = this.fb.group({
      url: ['http://127.0.0.1:5000/get'],
      httpMethod: ['GET'],
      headers: this.fb.array([]),
      queryParams: this.fb.array([]),
    });
  }

  get headers() {
    return this.myForm.get('headers') as FormArray;
  }

  addHeader() {
    const headerGroup = this.fb.group({
      key: [''],
      value: [''],
    });
    this.headers.push(headerGroup);
  }

  deleteHeader(index: number) {
    this.headers.removeAt(index);
  }

  get queryParams() {
    return this.myForm.get('queryParams') as FormArray;
  }

  addQueryParams() {
    const queryParamGroup = this.fb.group({
      key: [''],
      value: [''],
    });
    this.queryParams.push(queryParamGroup);
  }

  deleteQueryParam(index: number) {
    this.queryParams.removeAt(index);
  }

  onSubmit() {
    console.log('on submit');
    const formValue = this.myForm.value;

    let headers = new HttpHeaders();
    formValue.headers.forEach((header: any) => {
      headers = headers.set(header.key, header.value);
    });

    let params = new HttpParams();
    formValue.queryParams.forEach(
      (param: { key: string; value: string | number | boolean }) => {
        params = params.set(param.key, param.value);
      }
    );

    let url = formValue.url;
    let body = '{}';
    let httpMethod = formValue.httpMethod;
    let request$: Observable<any>;
    const options = {
      headers,
      params,
      observe: 'response' as const,
    };

    switch (httpMethod) {
      case 'GET':
        request$ = this.http.get<any>(url, options);
        break;
      case 'DELETE':
        request$ = this.http.delete<any>(url, options);
        break;
      case 'POST':
        request$ = this.http.post<any>(url, body, options);
        break;
      case 'PUT':
        request$ = this.http.put<any>(url, body, options);
        break;
      case 'PATCH':
        request$ = this.http.patch<any>(url, body, options);
        break;
      default:
        return;
    }

    return request$.subscribe({
      next: (response) => {
        this.responseData = `Statut: ${
          response.status
        }\nDonnées: ${JSON.stringify(response.body, null, 2)}`;
      },
      error: (error) => {
        this.responseData = `Erreur: ${error.status}\nMessage: ${error.message}`;
      },
    });
  }
}
