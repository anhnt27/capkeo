import { Injectable } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number';
import { NativeStorage } from '@ionic-native/native-storage';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { ToastController, LoadingController } from 'ionic-angular';

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
  public loading: any;

  // message 
  public processedOkMsg: string;
  public processedErrMsg: string;
  // constant
  public loadingTimeout: number;

  typeFindingTeam: number;
  typeFindingMatch: number;
  typeFindingPlayer: number;

  resultCodeSuccess: number;
  resultCodeErr: number;


  // for testing only
  public isTesting: boolean;

  constructor(
    public http: Http, 
    public toastCtrl: ToastController,
    public callNumber: CallNumber,
    public nativeStorage: NativeStorage,
    public loadingCtrl: LoadingController, 
  ) {
    this.apiDomain         = 'http://192.168.2.81/';
    
    // init message
    this.processedOkMsg    = 'Đã thực hiện thành công :)'; 
    this.processedErrMsg   = 'Có lỗi xảy ra :|. Xin thử lại :)'

    // init constant
    this.loadingTimeout    = 3000;
    this.typeFindingPlayer = 1;
    this.typeFindingTeam   = 2;
    this.typeFindingMatch  = 3;
    
    this.resultCodeSuccess = 200;
    this.resultCodeErr     = 500;
    
    // for testing only
    this.isTesting         = false;
    this.isTesting         = true;
  }

  // helper
  call(number)
  {
    console.log('calling...', number);
    this.callNumber.callNumber(number, true)
      .then(() => console.log('Launched dialer!'))
      .catch(() => console.log('Error launching dialer'));
  }

  handlePostResult(code, msg = '')
  {
    console.log(msg);
    if(msg === '') {
      switch (code)
      {
        case this.resultCodeSuccess:
          msg = this.processedOkMsg;
          break;
        case this.resultCodeErr:
          msg = this.processedErrMsg;
          break;
      }
    }

    this.presentToast(msg);
  }

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

  handleLoading()
  {
    this.loading = this.createLoading();
    this.loading.present();
    setTimeout(() => {
      this.loading.dismiss();
    }, this.loadingTimeout);
  }


  createLoading() 
  {
    return this.loadingCtrl.create({
      spinner: 'ios',
      dismissOnPageChange: false,
    });
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
    return await this.callPostApi(segment, notificationSetting);
  }

  // login handling
  sendAuthLogin(email: string, name: string, accessToken: string) 
  {
    let segment = 'auth/login';
    let auth = {email: email, name: name, inputToken: accessToken};
    return this.callPostApi(segment, auth);    
  }
  async sendRegistrationId(email, registrationId) 
  {
    let segment = 'registration';
    let data = {email: email, registrationId: registrationId};
    return this.callPostApi(segment, data);    
  }

  // helper api
  async getLocations() 
  {
    let segment = 'get-locations';    
    return this.callGetApi(segment);
  }

  getProperties(name) 
  {
    let segment = 'get-properties/' + name;
    return this.callGetApi(segment);
  }

  getAllProperties() 
  {
    let segment = 'get-all-properties';
    return this.callGetApi(segment);
  }

  // player
  getPlayer() {
    let segment = 'get-player';
    return this.callGetApi(segment);
  }
  updatePlayer(player) 
  {
    let segment = 'update-player';
    return this.callPostApi(segment, player);

  }

  // notification 
  getNotifications() {
    let segment = 'get-notifications';
    return this.callGetApi(segment);
  }

  // finding team
  getFindingTeams(district, position, level) 
  {
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
  getFindingPlayers(district, position, level) 
  {
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
  getFindingMatchs(district, level) 
  {
    console.log('calling get finding Match', district, level);
    if(!district || district.length == 0) {
      district = '0';
    }

    if(!level || level.length == 0) 
    {
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
  getFindingMatchById(id) 
  {
    let segment = 'get-finding-match/' + id;
    return this.callGetApi(segment);
  }

  //finding stadium
  getFindingStadiums(district) {
    console.log('calling get finding Stadium', district);
    if(!district) {
      district = '0';
    }

    let segment = 'get-stadium-by-district/' + district;
    return this.callGetApi(segment);
  }

  // team
  createTeam(team)
  {
    let segment = 'create-team';
    return this.callPostApi(segment, team);
  }

  //join
  addJoinTeam(join)
  {
    let segment = 'join-team';
    return this.callPostApi(segment, join);
  }

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

    if(this.isTesting) {
      let token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTkyLjE2OC4yLjgxL2F1dGgvbG9naW4iLCJpYXQiOjE0OTk0MjI3MDksImV4cCI6MTUwMzAyMjcwOSwibmJmIjoxNDk5NDIyNzA5LCJqdGkiOiJybDU1dHRwamg4Y2tLZndzIiwic3ViIjo0fQ.unA2uMPMO5qqS2tMi5qdZ4sqp1LUhGMkR2oRb97tfWE';
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
