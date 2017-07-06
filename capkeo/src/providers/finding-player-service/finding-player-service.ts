import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the FindingPlayerServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class FindingPlayerService {  
  public data: any;

  constructor(public http: Http) {
    console.log('Hello FindingPlayerServiceProvider Provider');
  }

  getFindingPlayers(district, position, level) {
    return new Promise(resolve => {
        this.http.get('http://192.168.2.81/get-finding-players/' + district + '/' + position + '/' + level)
          .map((res: Response) => res.json())
          .subscribe(data => {
            this.data = data;
            resolve(this.data);
          }, error => {
          
          });
      });
  }

  addFindingPlayer(findingPlayer) {
    console.log(findingPlayer);
    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    

    // var params = 'address=email@example.com&amp;pwd=xxxxxx';

    let postParams = {
      address: 'quyet tam 2 nguyen van luong'
    };
    
    this.http.post('http://192.168.2.81/add-finding-player', findingPlayer, options)
      .subscribe(data => {
        console.log(data);
       }, error => {
        console.log(error);
    });
  }

}

