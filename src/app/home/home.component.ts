import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {HttpService, isHttpResponse, Request} from '../http/http.service'
import {HttpErrorResponse} from "@angular/common/http";

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
    private httpService: HttpService
  ) {
  }

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
    const formValue = this.myForm.value;

    const request: Request = {
      url: formValue.url,
      method: formValue.httpMethod,
      headers: formValue.headers.reduce(
        (acc: { [key: string]: string }, header: { [key: string]: string }) => {
          acc[header.key] = header.value;
          return acc;
        }, {}),
      queryParams: formValue.queryParams.reduce(
        (acc: { [key: string]: string }, param: { [key: string]: string }) => {
          acc[param.key] = param.value;
          return acc;
        }, {}),
      // TODO : Ajouter la possibilité d'avoir un body dans la requête
      body: formValue.httpMethod === 'GET' || formValue.httpMethod === 'DELETE' ? null : '{}',
    };

    this.httpService
      .sendRequest(request)
      .subscribe({
        next: (response) => {
          if (isHttpResponse(response)) {
            this.responseData = `Status: ${response.status}\nData: ${JSON.stringify(response.body, null, 2)}`;
          } else {
            this.responseData = `Response is not of type Response`
          }
        },
        error: (error: HttpErrorResponse | Error) => {
          if (error instanceof HttpErrorResponse) {
            this.responseData = `Error: ${error.status}\nMessage: ${error.message}`;
          } else {
            this.responseData = `Error: ${error.message}`;
          }
        }
      });
  }
}
