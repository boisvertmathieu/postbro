import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { HttpCallerService } from '../services/http-caller.service';

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
    private httpCaller: HttpCallerService
  ) { }

  ngOnInit(): void {
    console.log('HomeComponent INIT');

    this.myForm = this.fb.group({
      url: ['http://127.0.0.1:5000/get'],
      httpMethod: ['GET'],
      headers: this.fb.array([]),
      queryParams: this.fb.array([]),
    });

    this.onChanges();
  }

  onChanges(): void {
    this.myForm.get('url')?.valueChanges.subscribe(val => {
      this.onUriChanges(val);
    });

    this.myForm.get('queryParams')?.valueChanges.subscribe(val => {
      //Waiting for the next tick. Event is fired before the change is bubbled up to its parent 
      //https://www.tektutorialshub.com/angular/valuechanges-in-angular-forms/
      setTimeout(() => { 
        const formParams = this.getFormHttpParams(this.myForm.value);
        this.updateUrlParams(formParams.toString())
      })

    })
  }

  updateUrlParams(urlParams: string) {
    const urlParts = this.url?.value.split('?');
    this.url?.setValue(urlParts[0] + '?' + urlParams, { emitEvent: false });
  }

  private onUriChanges(val: any) {
    const p = val.split('?');

    if (p.length == 2) {
      let h = new URLSearchParams(p[1]);

      this.queryParams.clear({ emitEvent: false });
      for (const param of h) {
        this.addQueryParam(param[0], param[1]);
      }
    }
  }

  get headers() {
    return this.myForm.get('headers') as FormArray;
  }

  get url() {
    return this.myForm.get('url');
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

  addQueryParam(key: string, value: string) {
    const queryParamGroup = this.fb.group({ key, value });
    this.queryParams.push(queryParamGroup, { emitEvent: false });
  }

  deleteQueryParam(index: number) {
    this.queryParams.removeAt(index);
  }

  onSubmit() {
    console.log('on submit');
    const formValue = this.myForm.value;

    let mapHeaders: Record<string, string[]> = {};
    this.headers.value.forEach((header: any) => {
      let key: string = header.key;
      if (key) {
        if (!mapHeaders[key]) {
          mapHeaders[key] = [header.value]
        } else {
          mapHeaders[key].push(header.value)
        }
      }
    });

    let headers = new HttpHeaders(mapHeaders);

    let params = this.getFormHttpParams(formValue);

    console.log(params)

    let url = formValue.url;
    let body = '{}';
    let httpMethod = formValue.httpMethod;

    let req = new HttpRequest(httpMethod, url, { headers: headers, params: params });

    return this.httpCaller.getApiResult(req).subscribe({
      next: (response) => {
        this.responseData = `Statut: ${response.status
          }\nDonnées: ${JSON.stringify(response.body, null, 2)}`;
      },
      error: (error) => {
        this.responseData = `Erreur: ${error.status}\nMessage: ${error.message}`;
      },
    });
  }

  private getFormHttpParams(formValue: any) {
    let mapParams: Record<string, string[]> = {};
    formValue.queryParams.forEach((param: any) => {
      let key: string = param.key;
      if (key) {
        if (!mapParams[key]) {
          mapParams[key] = [param.value];
        } else {
          mapParams[key].push(param.value);
        }
      }
    });

    return new HttpParams({ fromObject: mapParams });
  }
}
