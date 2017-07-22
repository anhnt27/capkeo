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
  public data            : any;
  public apiDomain       : string;
  public postResult      : any;
  jwtToken               : string;
  public loading         : any;
  
  // message 
  public processedOkMsg  : string;
  public processedErrMsg : string;
  // constant
  public loadingTimeout  : number;
  
  typeFindingTeam        : number;
  typeFindingMatch       : number;
  typeFindingPlayer      : number;
  typeJoinTeam           : number;
  typeInviteMember       : number;
  
  socialTypeGoogle       : number = 1;
  socialTypeFacebook     : number = 2;
  resultCodeSuccess      : number;
  resultCodeErr          : number;
  
  expiredDays            : number = 12;
  aheadDays              : number = 30;


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
    this.processedOkMsg    = 'Đã thực hiện thành công.'; 
    this.processedErrMsg   = 'Có lỗi xảy ra. Xin thử lại!'

    // init constant
    this.loadingTimeout     = 3000;
    this.typeFindingPlayer  = 1;
    this.typeFindingTeam    = 2;
    this.typeFindingMatch   = 3;
    this.typeJoinTeam       = 4;
    this.typeInviteMember   = 5;
    
    this.resultCodeSuccess  = 200;
    this.resultCodeErr      = 500;
    
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

  presentToast(message, time = 3000) 
  {
    let toast = this.toastCtrl.create({
      message: message,
      duration: time,
      position: 'top'
    });

    toast.onDidDismiss(() => {
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
  sendAuthLogin(socialType: number, email: string, name: string, accessToken: string) 
  {
    let segment = 'auth/login';
    let auth = {socialType: socialType, email: email, name: name, inputToken: accessToken};
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
  getPlayer() 
  {
    let segment = 'get-player';
    return this.callGetApi(segment);
  }
  getPlayerById(playerId) 
  {
    let segment = 'get-player/' + playerId;
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
  countUnreadNotifications() {
    let segment = 'count-unread-notifications';
    return this.callGetApi(segment);
  }
  updateNotificationIsRead(notification)
  {
    let segment = 'update-notification-is-read';
    return this.callPostApi(segment, notification);
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
  updateTeam(team)
  {
    let segment = 'update-team';
    return this.callPostApi(segment, team);
  }
  getTeam()
  {
    let segment = 'get-team';
    return this.callGetApi(segment);
  }
  getTeamPlayers()
  {
    let segment = 'get-team-players';
    return this.callGetApi(segment);
  }
  getTeamById(teamId)
  {
    let segment = 'get-team/' + teamId ;
    return this.callGetApi(segment);
  }
  removeMember(player)
  {
    let segment = 'remove-member';
    return this.callPostApi(segment, player);
  }

  // match
  createMatch(match)
  {
    let segment = 'create-match';
    return this.callPostApi(segment, match);
  }
  getMatches()
  {
    let segment = 'get-matches';
    return this.callGetApi(segment);
  }
  getMatch(id)
  {
    let segment = 'get-match/' + id;
    return this.callGetApi(segment);
  }
  confirmJoinMatch(confirm)
  {
    let segment = 'confirm-join-match';
    return this.callPostApi(segment, confirm);
  }


  //join
  addJoinTeam(join)
  {
    let segment = 'join-team';
    return this.callPostApi(segment, join);
  }
  updateJoinTeam(join)
  {
    let segment = 'update-join-team';
    return this.callPostApi(segment, join);
  }
  getJoiningTeamRequests()
  {
    let segment = 'get-joining-team-requests';
    return this.callGetApi(segment);
  }
  addInviteMember(join)
  {
    let segment = 'invite-member';
    return this.callPostApi(segment, join);
  }
  getInviteRequests()
  {
    let segment = 'get-invite-request';
    return this.callGetApi(segment);
  }
  updateInviteMember(join)
  {
    let segment = 'update-invite-member';
    return this.callPostApi(segment, join);
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
        // console.log(error);
      }
      );

    if(this.isTesting) 
    {
      // lenkeoapp
      let token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTkyLjE2OC4yLjgxL2F1dGgvbG9naW4iLCJpYXQiOjE1MDAyNzQwNTIsImV4cCI6MTUwMzg3NDA1MiwibmJmIjoxNTAwMjc0MDUyLCJqdGkiOiI1c1FLRG91VjE4N3ZhRTZwIiwic3ViIjoxfQ.qP2pUVxGRsod3LB2tWiGwDOR1nuYCjYN19ifgVLWNKw';
      // anh nguyen
      // let token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTkyLjE2OC4yLjgxL2F1dGgvbG9naW4iLCJpYXQiOjE1MDAwMjM2NTgsImV4cCI6MTUwMzYyMzY1OCwibmJmIjoxNTAwMDIzNjU4LCJqdGkiOiJzQWxFY1lDcmFlUnlNaVBSIiwic3ViIjo0fQ.QHiM0TF86CTWqytSFk4Nxh70lvWUmnqgC7uBaBBC_TM';
     
      // user 1
      // token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTkyLjE2OC4yLjgxL2F1dGgvbG9naW4iLCJpYXQiOjE1MDAwMzA2MzUsImV4cCI6MTUwMzYzMDYzNSwibmJmIjoxNTAwMDMwNjM1LCJqdGkiOiJGUmtlaEUwRjJNZVhyTzB4Iiwic3ViIjoxfQ.Av5pc16eoDgnzkQ4muwTp9v7CPzgib0b0AmhjQNxojM';
      
      //user 2
      // token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTkyLjE2OC4yLjgxL2F1dGgvbG9naW4iLCJpYXQiOjE1MDAwMzA2NjksImV4cCI6MTUwMzYzMDY2OSwibmJmIjoxNTAwMDMwNjY5LCJqdGkiOiJ2SllmOUdrMHJWMGhpaExaIiwic3ViIjoyfQ.5SbVaY1sTpzKKrDfwTXA5VZQhwNtZ3tjTfySMFfILW8';
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
          console.log(error);
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
}
