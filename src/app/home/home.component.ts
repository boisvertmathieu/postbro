import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {HttpService} from "./home.service";
import {HttpParams} from "@angular/common/http";
import {APP_CONFIG} from "environments/environment";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  myForm!: FormGroup;
  responseData: any;
  cityCode = '2732516'; //Quebec

  constructor(private router: Router, private fb: FormBuilder, private httpService: HttpService) {
  }

  ngOnInit(): void {
    console.log('HomeComponent INIT');

    this.myForm = this.fb.group({
      url: ['http://dataservice.accuweather.com/forecasts/v1/daily/1day/' + this.cityCode],
      queryParams: this.fb.array([])
    });
  }

  get queryParams() {
    return this.myForm.get('queryParams') as FormArray;
  }

  addQueryParams() {
    const queryParamGroup = this.fb.group({
      key: [''],
      value: ['']
    })
    this.queryParams.push(queryParamGroup)
  }

  deleteQueryParam(index: number) {
    this.queryParams.removeAt(index);
  }

  onSubmit() {
    const formValue = this.myForm.value;
    let queryParams = new HttpParams();

    formValue.queryParams.forEach((param: { key: string; value: string | number | boolean; }) => {
      queryParams = queryParams.set(param.key, param.value);
    })

    queryParams.set('apikey', `${APP_CONFIG.apiKey ? APP_CONFIG.apiKey : ''}`)

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    this.httpService.sendGetRequest(formValue.url, queryParams)
      .subscribe({
        next: (response) => {
          this.responseData = response;
        },
        error: (error) => {
          console.error('Erreur lors de la requête:', error);
        }
      });
  }

}
