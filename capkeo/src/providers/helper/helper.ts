import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the HelperService Service.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on Services and Angular DI.
*/
@Injectable()
export class HelperService {
  public data: any;
  public uri: string;
  constructor(public http: Http) {
    console.log('Hello HelperService Service');
  }
  
  getLocations() {
    return new Promise(resolve => {
        this.http.get('http://192.168.2.81/get-locations')
          .map((res: Response) => res.json())
          .subscribe(data => {
            this.data = data;
            resolve(this.data);
          }, error => {
          
          });
      });
  }

  getDistrictsByCity(cityId) {
    return new Promise(resolve => {
        this.http.get('http://192.168.2.81/get-districts/' + cityId)
          .map((res: Response) => res.json())
          .subscribe(data => {
            this.data = data;
            resolve(this.data);
          }, error => {
          
          });
      });
  }

  getProperties(name) {
    return new Promise(resolve => {
        this.http.get('http://192.168.2.81/get-properties/' + name)
          .map((res: Response) => res.json())
          .subscribe(data => {
            this.data = data;
            resolve(this.data);
          }, error => {
          
          });
      });
  }

}
