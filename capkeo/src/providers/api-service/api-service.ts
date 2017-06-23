import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the ApiServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ApiService {
  public data: any;
  public uri: string;
  constructor(public http: Http) {
    this.uri = 'http://192.168.2.81/';
    console.log('Hello ApiServiceProvider Provider');
  }

  load(info: string ) {
      return new Promise(resolve => {
        // We're using Angular HTTP provider to request the data,
        // then on the response, it'll map the JSON data to a parsed JS object.
        // Next, we process the data and resolve the promise with the new data.
        // this.http.get('https://randomuser.me/api/?results=10')
        this.http.get('http://192.168.2.81/foo/' + info)
          .map((res: Response) => res.json())
          .subscribe(data => {
            // we've got back the raw data, now generate the core schedule data
            // and save the data for later reference
            alert('success called' + info);
            this.data = data;
            alert(data);
            resolve(this.data);
          }, error => {
            alert('error returned' + info);
            });
      });
    }

    sendAuthLogin(email: string, name: string ) {
      return new Promise(resolve => {
        // We're using Angular HTTP provider to request the data,
        // then on the response, it'll map the JSON data to a parsed JS object.
        // Next, we process the data and resolve the promise with the new data.
        // this.http.get('https://randomuser.me/api/?results=10')
        this.http.get('http://192.168.2.81/login/' + email + '/' + name)
          .map((res: Response) => res.json())
          .subscribe(data => {
            // we've got back the raw data, now generate the core schedule data
            // and save the data for later reference
            this.data = data;
            resolve(this.data);
          }, error => {
            });
      });
    }

    sendRegistrationId(email: string, registrationId: string ) {
      return new Promise(resolve => {
        // We're using Angular HTTP provider to request the data,
        // then on the response, it'll map the JSON data to a parsed JS object.
        // Next, we process the data and resolve the promise with the new data.
        // this.http.get('https://randomuser.me/api/?results=10')
        this.http.get('http://192.168.2.81/registration/' + email + '/' + registrationId)
          .map((res: Response) => res.json())
          .subscribe(data => {
            // we've got back the raw data, now generate the core schedule data
            // and save the data for later reference
            this.data = data;
            resolve(this.data);
          }, error => {
            });
      });
    }

    __sendAuthLogin(email: string, name: string) {
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/json' );
        let options = new RequestOptions({ headers: headers });
     
        let postParams = {
          email: email,
          name: name,
        }
        
        this.http.post('http://192.168.2.81/auth/login', postParams)
          .subscribe(data => {
            alert(data);
           }, error => {
            alert(error);
            console.log(error);// Error getting the data
          });
    }
}
