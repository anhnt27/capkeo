import { Component } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';

import { ApiService } from '../../providers/api-service/api-service';

/**
 * Generated class for the SettingPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
  providers: [ApiService]
})
export class SettingPage {
  isReceiveFindingTeam   : boolean;
  isReceiveFindingMatch  : boolean;
  isReceiveFindingPlayer : boolean;

  typeFindingTeam: number;
  typeFindingMatch: number;
  typeFindingPlayer: number;

  notificationSetting: any;

  cities          : any;
  districts       : any;
  districtsByCity : any;
  positions       : any;
  levels          : any;
  filterData      : any;
  
  currentPlayer   : any;
  settingSegment  : string;

  constructor(
    public navParams     : NavParams,
    public apiService    : ApiService,
    public navCtrl       : NavController, 
    public modalCtrl     : ModalController, 
    public nativeStorage : NativeStorage,
    ) 
  {
    this.settingSegment = "notifications";
    
    this.typeFindingTeam   = this.apiService.typeFindingTeam;
    this.typeFindingMatch  = this.apiService.typeFindingMatch;
    this.typeFindingPlayer = this.apiService.typeFindingPlayer;

    this.levels          = navParams.data.levels;
    this.cities          = navParams.data.cities;
    this.positions       = navParams.data.positions;
    this.districtsByCity = navParams.data.districtsByCity;
    this.currentPlayer   = navParams.data.currentPlayer;
    this.filterData      = navParams.data.defaultFilterData;

    this.isReceiveFindingTeam   = this.currentPlayer.is_receive_player_finding_team;
    this.isReceiveFindingMatch  = this.currentPlayer.is_receive_team_finding_match;
    this.isReceiveFindingPlayer = this.currentPlayer.is_receive_team_finding_player;


  } 

  async ionViewDidLoad() 
  {
    this.apiService.handleLoading();
    await this.updateDistrict();
  }


  updateDistrict() 
  {
    if(this.currentPlayer.city_id) {
      this.districts  = this.districtsByCity[this.currentPlayer.city_id].districts;
    }
  }

  saveProfile()
  {
    this.apiService.handleLoading();
    this.apiService.updatePlayer(this.currentPlayer)
    .then((data: any) => {
      this.apiService.handlePostResult(data.code);
    }, error => console.log(error));
  }

  async toggleChange(type) 
  {
    // this.apiService.handleLoading();
    switch (type) 
    {
      case this.typeFindingTeam:
        this.currentPlayer.is_receive_player_finding_team = this.isReceiveFindingTeam;
        if(this.isReceiveFindingTeam) this.openFindingPlayerSettingModal(type);
        break;
      case this.typeFindingMatch:
        this.currentPlayer.is_receive_team_finding_match = this.isReceiveFindingMatch;
        if(this.isReceiveFindingMatch) this.openFindingPlayerSettingModal(type);
        break;
      case this.typeFindingPlayer:
        this.currentPlayer.is_receive_team_finding_player = this.isReceiveFindingPlayer;
        if(this.isReceiveFindingPlayer) this.openFindingPlayerSettingModal(type);
        break;
    }

    this.apiService.updatePlayer(this.currentPlayer)
    .then((data: any) => {
      this.apiService.handlePostResult(data.code);
    }, error => console.log(error));
  }

  // open filter
  async openFindingPlayerSettingModal(type) {
    // call api to get current setting first.
    this.apiService.handleLoading();
    let env = this;
    await this.apiService.getNotificationSetting(type)
    .then(data => {
      env.notificationSetting = data;
    }, error => console.log(error));

    let data = {cities: this.cities, districtsByCity: this.districtsByCity, 
      positions: this.positions, levels: this.levels, filterData: this.filterData, type: type, 
      notificationSetting: this.notificationSetting
    };
    let modal = this.modalCtrl.create(FindingPlayerSettingModal, data);

    modal.onDidDismiss(data => {
      if(data) {
        this.apiService.handleLoading();
        let notificationSetting = data;
        env.apiService.saveNotificationSetting(notificationSetting)
        .then((data: any) => {
          env.apiService.handlePostResult(data.code);
        }, error => console.log(error));
      }
    });
    modal.present();
  }

  call(phoneNumber)
  {
    this.apiService.call(phoneNumber);
  }
}

@Component({
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>
          Tùy chọn nhận thông báo
        </ion-title>
        <ion-buttons start>
          <button ion-button (click)="dismiss()">
            <span ion-text color="light" showWhen="ios">Cancel</span>
            <ion-icon name="md-close" showWhen="android,windows"></ion-icon>
          </button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <ion-item>
          <ion-label stacked>Thành Phố</ion-label>
          <ion-select [(ngModel)]="selectedCity" (ngModelChange)="updateDistrict()" cancelText="Cancel" okText="Select">
            <ion-option *ngFor="let city of cities" value="{{city.id}}">{{city.name}}</ion-option>
          </ion-select>
        </ion-item>
        <ion-item>
          <ion-label stacked>Quận/Huyện</ion-label>
          <ion-select multiple="true" [(ngModel)]="selectedDistricts">
            <ion-option *ngFor="let district of districts" value="{{district.id}}">{{district.name}}</ion-option>
          </ion-select>
        </ion-item>
        <ion-item *ngIf="type !== this.apiService.typeFindingMatch">
          <ion-label stacked>Vị Trí</ion-label>
          <ion-select multiple="true" [(ngModel)]="selectedPositions" >
            <ion-option *ngFor="let position of positions" value="{{position.id}}">{{position.value}}</ion-option>
          </ion-select>
        </ion-item>
        <ion-item>
          <ion-label stacked>Trình</ion-label>
          <ion-select multiple="true" [(ngModel)]="selectedLevels">
            <ion-option *ngFor="let level of levels" value="{{level.id}}">{{level.value}}</ion-option>
          </ion-select>
        </ion-item>
      </ion-list>
      <ion-fab right bottom>
        <ion-buttons end>
          <button ion-fab color="primary" (click)="save()">
            <ion-icon name="send"></ion-icon>
          </button>
        </ion-buttons>
      </ion-fab>
    </ion-content>
  `,
})
export class FindingPlayerSettingModal {
  cities: any;
  districtsByCity: any;
  districts: any;
  positions: any;
  levels: any;
  currentDate: string;
  notificationSetting: any;

  selectedCity: any;
  selectedDistricts: any;
  selectedPositions: any;
  selectedLevels: any;

  filterData: any;

  type: number;

  constructor(
    public params: NavParams,
    public apiService: ApiService,
    public viewCtrl: ViewController,
  ) {
    this.currentDate         = new Date().toISOString();
    this.levels              = this.params.get('levels');
    this.cities              = this.params.get('cities');
    this.positions           = this.params.get('positions');
    this.districtsByCity     = this.params.get('districtsByCity');
    this.notificationSetting = this.params.get('notificationSetting');

    this.type       = this.params.get('type');
    this.filterData = this.params.get('filterData');
    console.log(this.notificationSetting);

    this.selectedCity      = (this.notificationSetting.cityId && this.notificationSetting.cityId.length) ? this.notificationSetting.cityId : this.filterData.cityId;
    this.updateDistrict();
    this.selectedLevels    = this.notificationSetting.levelIds.length ? this.notificationSetting.levelIds : this.filterData.levelIds;
    this.selectedDistricts = this.notificationSetting.districtIds.length ? this.notificationSetting.districtIds : this.filterData.districtIds;
    this.selectedPositions = this.notificationSetting.positionIds.length ? this.notificationSetting.positionIds : this.filterData.positionIds;
  }
  updateDistrict() {
    if(this.selectedCity) {
      this.districts = this.districtsByCity[this.selectedCity].districts;
    }
  }

  save() {
    let data = {'cityId': this.selectedCity, 'districtIds': this.selectedDistricts, 'positionIds': this.selectedPositions, 'levelIds': this.selectedLevels, type: this.type};
    this.viewCtrl.dismiss(data);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}