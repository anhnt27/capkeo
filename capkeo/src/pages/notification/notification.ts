import { Component } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage';
import { IonicPage, NavController, NavParams, ModalController, Events } from 'ionic-angular';

import { SettingPage } from '../setting/setting';
import { ModalFindingTeamDetail } from '../finding-team/finding-team';
import { ModalFindingMatchDetail } from '../finding-match/finding-match';
import { ModalFindingPlayerDetail } from '../finding-player/finding-player';

import { ModalPlayerDetail, ModalTeamDetail } from '../../pages/team/team';

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
  isReady : boolean = false;
  notifications  : any;
  email          : string;
  jwtToken       : string;
  registrationId : string;


  constructor(
    public events: Events, 
    public navParams: NavParams, 
    public apiService: ApiService,
    public navCtrl: NavController, 
    public modalCtrl: ModalController, 
    public nativeStorage: NativeStorage, 
    public constantService: ConstantService,
  ) {
    this.notifications = [];
  }

  async doRefresh(refresher)
  {
    await this.getNotifications();
    refresher.complete();
  }

  openSetting()
  {
    this.navCtrl.parent.select(3);
  }
  setting()
  {
    this.navCtrl.setRoot(SettingPage);
  }

  async ionViewDidLoad() {
    this.apiService.handleLoading();
    
    await this.getNotifications();
  }

  async navigateToDetail(notification) 
  {
    // update isRead
    console.log(notification);
    this.apiService.handleLoading();



    // this.navCtrl.parent.select(2);
    // this.navCtrl.parent.countUnreadNotifications();

    switch(notification.data.params.type) 
    {
      case this.apiService.typeFindingPlayer:
        this.apiService.getFindingPlayerById(notification.data.params.id)
        .then(data => {
          let dataForModal = {findingPlayer: data};
          console.log('open modal');
          this.openDetailModal(ModalFindingPlayerDetail, dataForModal);
        }, error => console.log(error));
        break;
      case this.apiService.typeFindingTeam:
        this.apiService.getFindingTeamById(notification.data.params.id)
        .then(data => {
          let dataForModal = {findingTeam: data};
          this.openDetailModal(ModalFindingTeamDetail, dataForModal);
        }, error => console.log(error));
        break;
      case this.apiService.typeFindingMatch:
        this.apiService.getFindingMatchById(notification.data.params.id)
        .then(data => {
          let dataForModal = {findingMatch: data};
          this.openDetailModal(ModalFindingMatchDetail, dataForModal);
        }, error => console.log(error));
        break;
      case this.apiService.typeJoinTeam:
        this.apiService.getPlayerById(notification.data.params.player_id)
        .then(data => {
          let dataForModal = {player: data};
          this.openDetailModal(ModalPlayerDetail, dataForModal);
        }, error => console.log(error));
        break;
      case this.apiService.typeInviteMember:
        this.apiService.getTeamById(notification.data.params.team_id)
        .then(data => {
          let dataForModal = {team: data};
          this.openDetailModal(ModalTeamDetail, dataForModal);
        }, error => console.log(error));
        break;
      default:
        break;
    }
    if(! notification.read_at) {
      await this.apiService.updateNotificationIsRead({id: notification.id});
      this.events.publish('read:notification');
      this.getNotifications();
    }
  }

  openDetailModal(modalName, data) {
    let modal = this.modalCtrl.create(modalName, data);
    modal.onDidDismiss((data: any) => {
    });

    modal.present();
  }

  async getNotifications() {
    await this.apiService.getNotifications().
    then(data => {
      this.notifications = data;
      this.isReady = true;
    },
    error => console.log(error)
    );
  }

  
}


