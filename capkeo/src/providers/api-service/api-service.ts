import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { ToastController } from 'ionic-angular';
import 'rxjs/add/operator/map';

/*
  Generated class for the ApiServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ApiService {
  public data: any;
  public apiDomain: string;
  public postResult: any;
  jwtToken: string;

  // message 
  public addedOkMsg: string;
  public addedOkErr: string;
  constructor(
    public http: Http, 
    public toastCtrl: ToastController,
    public nativeStorage: NativeStorage,
  ) {
    this.apiDomain = 'http://192.168.2.81/';

    // init message
    this.addedOkMsg = 'Đã thực hiện thành công :)'; 
    this.addedOkErr = 'Có lỗi xảy ra. Xin thử lại :('
  }

  // helper
  presentToast(message) 
  {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  getDefaultFilter() 
  {
    return {'cityId': 1, 'districtIds': 1, 'levelIds': 7};

  }

  // notification setting
  getNotificationSetting(type)
  {
    let segment = 'get-notification-setting/' + type;    
    return this.callGetApi(segment)
  }

  async saveNotificationSetting(notificationSetting) 
  {
    let segment = 'save-notification-setting';
    await this.callPostApi(segment, notificationSetting);
    return this.postResult;
  }

  // login handling
  sendAuthLogin(email: string, name: string, accessToken: string) {
    let segment = 'auth/login';
    let auth = {email: email, name: name, inputToken: accessToken};
    return this.callPostApi(segment, auth);    
  }
  async sendRegistrationId(email, registrationId) {
    let segment = 'registration';
    let data = {email: email, registrationId: registrationId};
    return this.callPostApi(segment, data);    
  }

  // helper api
  async getLocations() {
    let segment = 'get-locations';    
    return this.callGetApi(segment);
  }

  getProperties(name) {
    let segment = 'get-properties/' + name;
    return this.callGetApi(segment);
  }
  getAllProperties() {
    let segment = 'get-all-properties';
    return this.callGetApi(segment);
  }

  // notification 
  getNotifications() {
    let segment = 'get-notifications';
    return this.callGetApi(segment);
  }
  // finding team
  getFindingTeams(district, position, level) {
    if(!district) {
      district = '0';
    }
    if(!position || position.length == 0) {
      position = '0';
    }
    if(!level) {
      level = '0';
    }
    let segment = 'get-finding-teams/' + district + '/' + position + '/' + level;
    return this.callGetApi(segment);
  }
  addFindingTeam(findingteam) 
  {
    console.log('add finding team called');
    let segment = 'add-finding-team';
    return this.callPostApi(segment, findingteam);
  }
  getFindingTeamById(id) {
    let segment = 'get-finding-team/' + id;
    return this.callGetApi(segment);
  }

  // finding player
  getFindingPlayers(district, position, level) {
    console.log('calling get finding player', district, position, level);
    if(!district) {
      district = '0';
    }
    if(!position || position.length == 0) {
      position = '0';
    }
    if(!level) {
      level = '0';
    }
    let segment = 'get-finding-players/' + district + '/' + position + '/' + level;
    return this.callGetApi(segment);
  }
  async addFindingPlayer(findingPlayer) 
  {
    let segment = 'add-finding-player';
    return this.callPostApi(segment, findingPlayer);
  }
  getFindingPlayerById(id) {
    let segment = 'get-finding-player/' + id;
    return this.callGetApi(segment);
  }

  // finding match
  getFindingMatchs(district, level) {
    console.log('calling get finding Match', district, level);
    if(!district || district.length == 0) {
      district = '0';
    }

    if(!level || level.length == 0) {
      level = '0';
    }
    let segment = 'get-finding-matchs/' + district + '/' + level;
    return this.callGetApi(segment);
  }
  async addFindingMatch(findingMatch) 
  {
    let segment = 'add-finding-match';
    return this.callPostApi(segment, findingMatch);
  }
  getFindingMatchById(id) {
    let segment = 'get-finding-match/' + id;
    return this.callGetApi(segment);
  }
  //

  getJwtToken() {
  }

  async prepareHeader(isContentRequired){
    // await this.getJwtToken();
    let env = this;
    await this.nativeStorage.getItem('jwtToken')
      .then(
      data => {
        env.jwtToken = data;
      },
      error => {
        console.log(error);
      }
      );

    let isTest = false;
    isTest = true;
    if(isTest) {
      let token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTkyLjE2OC4yLjgxL2F1dGgvbG9naW4iLCJpYXQiOjE0OTkyMzcxMDUsImV4cCI6MTUwMjgzNzEwNSwibmJmIjoxNDk5MjM3MTA1LCJqdGkiOiJtaEEwcGJWRFJnVEw2SzJYIiwic3ViIjo0fQ.z0zt_F2l-af0iZ-OekUeXDvW-wMU2DoHIRv6nWzM_1I';
      this.jwtToken = token;
    }

    // alert('got jwtToken:' + this.jwtToken);
    var headers = new Headers();

    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Access-Control-Max-Age', '3600');
    headers.append('Authorization', 'Bearer ' + this.jwtToken);
    headers.append('Access-Control-Allow-Credentials', 'true');

    return new RequestOptions({ headers: headers });
  }
  async callGetApi(segment)
  {
    let optionsBK = await this.prepareHeader(true);
    let env = this;
    return new Promise(resolve => {
      this.http.get(env.apiDomain + segment, optionsBK)
        .map((res: Response) => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        }, error => {
        
        });
    });
  }
  
  async callPostApi(segment, params)
  {
    let env = this;
    let options = await this.prepareHeader(false);
    return new Promise(resolve => {
      this.http.post(env.apiDomain + segment, params, options)
      .map((res: Response) => res.json())
        .subscribe(data => {
          env.postResult = true;
          this.data = data;
          resolve(this.data);
         }, error => {
          console.log(error);
          env.postResult = false;
      });
    });
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
  
}
