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

  cities: any;
  districts: any;
  districtsByCity: any;
  positions: any;
  levels: any;
  properties: any;
  filterData: any;

  player: any;

  constructor(
    public navParams: NavParams,
    public apiService: ApiService,
    public navCtrl: NavController, 
    public modalCtrl: ModalController, 
    public nativeStorage : NativeStorage,
    ) 
  {
    this.typeFindingTeam   = this.apiService.typeFindingTeam;
    this.typeFindingMatch  = this.apiService.typeFindingMatch;
    this.typeFindingPlayer = this.apiService.typeFindingPlayer;
    this.player = {};
  } 

  async ionViewDidLoad() 
  {
    this.apiService.handleLoading();
    await this.getLocations();
    await this.getPositions();
    await this.getLevels();
    await this.getAllProperties();

    await this.getPlayer();
    await this.updateDistrict();
  }

  async getPlayer()
  {
    await this.apiService.getPlayer()
    .then((data: any) => {
      this.player = data;
      this.isReceiveFindingTeam   = data.is_receive_player_finding_team;
      this.isReceiveFindingMatch  = data.is_receive_team_finding_match;
      this.isReceiveFindingPlayer = data.is_receive_team_finding_player;
    }, error =>console.log(error)
    );
  }

  updateDistrict() 
  {
    if(this.player.city_id) {
      this.districts  = this.districtsByCity[this.player.city_id].districts;
    }
  }

  saveProfile()
  {
    this.apiService.handleLoading();
    this.apiService.updatePlayer(this.player)
    .then((data: any) => {
      this.apiService.handlePostResult(data.code);
    }, error => console.log(error));
  }

  async toggleChange(type) 
  {
    switch (type) 
    {
      case this.typeFindingTeam:
        this.player.is_receive_player_finding_team = this.isReceiveFindingTeam;
        if(this.isReceiveFindingTeam) this.openFindingPlayerSettingModal(type);
        break;
      case this.typeFindingMatch:
        this.player.is_receive_team_finding_match = this.isReceiveFindingMatch;
        if(this.isReceiveFindingMatch) this.openFindingPlayerSettingModal(type);
        break;
      case this.typeFindingPlayer:
        this.player.is_receive_team_finding_player = this.isReceiveFindingPlayer;
        if(this.isReceiveFindingPlayer) this.openFindingPlayerSettingModal(type);
        break;
    }

    this.apiService.updatePlayer(this.player)
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

    console.log(this.notificationSetting);

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
          console.log('saved notificationSetting', data);
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
  // get data
  getLocations() {
    this.apiService.getLocations()
    .then(data => {
      this.cities = data['results']['cities'];
      this.districtsByCity  = data['results']['districts_by_city'];
    });
  }
  getPositions() {
    this.apiService.getProperties('position')
    .then(data => {
      this.positions = data;
    });
  }

  getLevels() {
    this.apiService.getProperties('level')
    .then(data => {
      this.levels = data;
    });
  }
  getAllProperties() {
    this.apiService.getAllProperties()
    .then(data => {
      this.properties = data;
    });
  }


  // getLocations() {
  //   this.nativeStorage.getItem('locations')
  //   .then(data => {
  //     this.cities = data['results']['cities'];
  //     this.districtsByCity  = data['results']['districts_by_city'];
  //   });
  // }
  // getPositions() {
  //   this.nativeStorage.getItem('positions')
  //   .then(data => {
  //     this.positions = data;
  //   });
  // }

  // getLevels() {
  //   this.nativeStorage.getItem('levels')
  //   .then(data => {
  //     this.levels = data;
  //   });
  // }
  // getAllProperties() {
  //   this.nativeStorage.getItem('allProperties')
  //   .then(data => {
  //     this.properties = data;
  //   });
  // }
}

@Component({
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>
          Loc Doi
        </ion-title>
        <ion-buttons start>
          <button ion-button (click)="dismiss()">
            <span ion-text color="primary" showWhen="ios">Cancel</span>
            <ion-icon name="md-close" showWhen="android,windows"></ion-icon>
          </button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-card>
        <ion-card-header>
        </ion-card-header>
        <ion-card-content>
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
            <ion-item>
                <button ion-button full (click)="save()">Lưu</button>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>

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
    this.currentDate     = new Date().toISOString();

    this.levels          = this.params.get('levels');
    this.cities          = this.params.get('cities');
    this.positions       = this.params.get('positions');
    this.districtsByCity = this.params.get('districtsByCity');
    this.notificationSetting = this.params.get('notificationSetting');

    console.log(this.notificationSetting);

    this.type      = this.params.get('type');
    this.filterData      = this.params.get('filterData');

    this.selectedCity = this.notificationSetting.cityId;
    this.updateDistrict();
    this.selectedPositions = this.notificationSetting.positionIds;
    this.selectedLevels = this.notificationSetting.levelIds;

    this.selectedDistricts = this.notificationSetting.districtIds;
  }
  updateDistrict() {
    if(this.selectedCity) {
      this.districts = this.districtsByCity[this.selectedCity].districts;
    }

    // this.selectedDistrict = this.filterData.districtIds;
  }

  save() {
    let data = {'cityId': this.selectedCity, 'districtIds': this.selectedDistricts, 'positionIds': this.selectedPositions, 'levelIds': this.selectedLevels, type: this.type};
    this.viewCtrl.dismiss(data);
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
}