import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';

import { FindingPlayerPage } from '../finding-player/finding-player';
import { FindingTeamPage } from '../finding-team/finding-team';
import { FindingMatchPage } from '../finding-match/finding-match';

import { ApiService } from '../../providers/api-service/api-service';
import { ConstantService } from '../../providers/constant-service/constant-service';
/**
 * Generated class for the NotificationPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
  providers: [ApiService]
})
export class NotificationPage {
  notifications: any;
  email: string;
  registrationId: string;
  jwtToken: string;

  typeFindingPlayer: number;
  typeFindingMatch: number;
  typeFindingTeam: number;

  constructor(
    public navParams: NavParams, 
    public apiService: ApiService,
    public navCtrl: NavController, 
    public nativeStorage: NativeStorage, 
    public constantService: ConstantService,
  ) {
    this.typeFindingPlayer = 1;
    this.typeFindingTeam   = 2;
    this.typeFindingMatch  = 3;

    this.sendRegistrationId();
    this.getNotifications();

  }

  async navigateToDetail(notification) 
  {
    switch(notification.data.params.type) 
    {
      case this.typeFindingPlayer:
        this.apiService.getFindingPlayerById(notification.data.params.id)
        .then(data => {
          this.navCtrl.setRoot(FindingPlayerPage, {findingPlayer: data});
        }, error => console.log(error));
        break;
      case this.typeFindingTeam:
        this.apiService.getFindingTeamById(notification.data.params.id)
        .then(data => {
          this.navCtrl.setRoot(FindingTeamPage, {findingTeam: data});
        }, error => console.log(error));
        break;
      case this.typeFindingMatch:
        this.apiService.getFindingMatchById(notification.data.params.id)
        .then(data => {
          this.navCtrl.setRoot(FindingMatchPage, {findingMatch: data});
        }, error => console.log(error));
        break;
    }
  }

  getNotifications() {
    this.apiService.getNotifications().
    then(data => {
      console.log(data);
      this.notifications = data;
    },
    error => console.log(error)
    );
  }

  async sendRegistrationId() {
    let env = this;
    await this.nativeStorage.getItem('user')
      .then(
      data => {
        env.email = data.email;
      },
      error => console.error(error)
      );
    await this.nativeStorage.getItem('registrationId')
      .then(
      data => {
        env.registrationId = data.value
      },
      error => console.error(error)
      );
    await this.apiService.sendRegistrationId(this.email, this.registrationId);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationPage');
  }

}


