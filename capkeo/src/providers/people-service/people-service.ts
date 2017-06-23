import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the PeopleServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class PeopleService {
  public data: any;
  constructor(public http: Http) {
    console.log('Hello PeopleServiceProvider Provider');
  }

  load(info: string ) {
      if (this.data) {
        // already loaded data
        return Promise.resolve(this.data);
      }
      // don't have the data yet
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
            // alert(data);
            resolve(this.data);
          }, error => {
            alert(error);
            alert('error returned' + info);
            });
      });
    }

}
