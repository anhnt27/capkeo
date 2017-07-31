import { Component } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number';
import { NativeStorage } from '@ionic-native/native-storage';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Platform, ModalController, ViewController, PopoverController  } from 'ionic-angular';

import { ModalTeamDetail } from '../../pages/team/team';

import { ApiService } from '../../providers/api-service/api-service';
/**
 * Generated class for the FindingPlayerPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-finding-player',
  templateUrl: 'finding-player.html',
  providers: [ApiService]
})
export class FindingPlayerPage { 
  findingPlayers  : any;
  cities          : any;
  districts       : any;
  districtsByCity : any;
  positions       : any;
  levels          : any;
  properties      : any;

  selectedCity     : any;
  selectedDistrict : any;
  selectedPosition : any;
  selectedLevel    : any;

  currentDate     : string;
  expiredDate     : string;
  maxDate         : string;
  minDate         : string;

  filterData    : any;
  currentPlayer : any;

  defaultFilterData   : any;
  notificationSetting : any;

  constructor(
    public platform      : Platform, 
    public navParams     : NavParams, 
    public apiService    : ApiService,
    public navCtrl       : NavController, 
    public modalCtrl     : ModalController, 
    public nativeStorage : NativeStorage,
    public popoverCtrl   : PopoverController ,
    ) 
  {
  } 

  async ionViewDidLoad() 
  {
    if(this.navParams.data) {
      this.cities            = this.navParams.data.cities;
      this.levels            = this.navParams.data.levels;
      this.positions         = this.navParams.data.positions;
      this.currentPlayer     = this.navParams.data.currentPlayer;
      this.districtsByCity   = this.navParams.data.districtsByCity;
      this.defaultFilterData = this.navParams.data.defaultFilterData;
      this.filterData        = this.navParams.data.defaultFilterData;
    } 

    this.apiService.handleLoading();
    await this.getFindingPlayers();
    this.getNotificationSetting();
  }

  async doRefresh(refresher)
  {
    await this.getFindingPlayers();
    refresher.complete();
  }
  // get data
  async getFindingPlayers() 
  {
    await this.apiService.getFindingPlayers(this.filterData.districtIds,'0', this.filterData.levelIds).
    then(data => {
      this.findingPlayers = data;
    }, error => {
      console.log(error);
    });
  }

  async getNotificationSetting()
  {
    await this.apiService.getNotificationSetting(this.apiService.typeFindingPlayer)
    .then(data => {
      this.notificationSetting = data;
    }, error => console.log(error));

  }

  // open modal
  async openAddModal(){
    let modal = this.modalCtrl.create(ModalAddFindingPlayer, this.navParams.data);
    modal.onDidDismiss((data: any) => {
      if(data) {
        this.apiService.handlePostResult(data.code);
      }
      this.getFindingPlayers();
    });


    modal.present();
  }

  openDetailModal(findingPlayer) {
    let data = {findingData: findingPlayer};
    let modal = this.modalCtrl.create(ModalFindingPlayerDetail, data);
    modal.present();
  }

  openFilterModal() {
    let data = {
      cities              : this.cities, 
      levels              : this.levels, 
      positions           : this.positions, 
      districtsByCity     : this.districtsByCity, 
      notificationSetting : this.notificationSetting,
    };
    let modal = this.modalCtrl.create(ModalFilterFindingPlayer, data);

    modal.onDidDismiss(data => {
      if(data) {
        this.apiService.handleLoading();
        this.filterData = {'cityId': data.cityId, 'districtIds': data.districtIds, 'positionIds': data.positionIds, 'levelIds': data.levelIds};
        this.apiService.getFindingPlayers(data.districtIds, data.positionIds, data.levelIds).
        then(data => {
          this.findingPlayers = data;
        }, error => {
          console.log(error);
        });
      }
    });
    modal.present();
  }
}

@Component({
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>
          Chi tiết
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

      <ion-item-group>
        <ion-item-divider color="light">Địa điểm</ion-item-divider>
        <ion-item>
          <label>Thành phố</label>
          <p item-end>{{findingData.city_name}}</p>
        </ion-item>
        <ion-item>
          <ion-label>Quận</ion-label>
          <p item-end>{{findingData.district_name}}</p>
        </ion-item>
        <ion-item *ngIf="findingData.address">
          <ion-label>Địa chỉ</ion-label>
          <p>{{findingData.address}}</p>
        </ion-item>
      </ion-item-group>

      <ion-item-group *ngIf="findingData.date || findingData.time">
        <ion-item-divider color="light">Thời gian</ion-item-divider>
        <ion-item *ngIf="findingData.date">
          <label>Ngày</label>
          <p item-end>{{findingData.date}}</p>
        </ion-item>
        <ion-item *ngIf="findingData.time">
          <label>Giờ</label>
          <p item-end>{{findingData.time}}</p>
        </ion-item>
      </ion-item-group>

      <ion-item-group>
        <ion-item-divider color="light">Cần tìm</ion-item-divider>
        <ion-item>
          <label>Loại sân</label>
          <p item-end>{{findingData.ground_type_name}}</p>
        </ion-item>
        <ion-item>
          <ion-label>Vị Trí</ion-label>
          <p item-end>{{findingData.position_name}}</p>
        </ion-item>
        <ion-item>
          <ion-label>Trình độ</ion-label>
          <p item-end>{{findingData.level_name}}</p>
        </ion-item>
        <ion-item *ngIf="findingData.message" text-wrap>
          <h2>Lời nhắn</h2>
          <p>{{findingData.message}}</p>
        </ion-item>
      </ion-item-group>

      <ion-item-group>
        <ion-item-divider color="light">Liên hệ</ion-item-divider>
        <ion-item>
          <h2>Tên</h2>
          <p item-end>{{findingData.player_name}}</p>
        </ion-item>
        <ion-item>
          <h2>SĐT</h2>
          <p item-end>{{findingData.phone_number}}</p>
          <ion-icon name="call" item-start (click)="call(findingData.phone_number)" smaill color="secondary"></ion-icon>
        </ion-item>
      </ion-item-group>

      <ion-item *ngIf="false">
        <label>Chi tiết đội bóng</label>
        <button ion-button clear item-end (click)="openDetailModal(findingData.team_id)">Xem</button>
      </ion-item>
      
      <ion-item *ngIf="!findingData.by_admin">
        <h2> Xin gia nhap doi bong </h2>
        <ion-icon name="person-add" item-end></ion-icon>
      </ion-item>
    </ion-content>
  `,
})
export class ModalFindingPlayerDetail {
  team;
  findingData;
  constructor(
    public platform : Platform,
    public params   : NavParams,
    public callNumber: CallNumber,
    public apiService : ApiService,
    public viewCtrl : ViewController,
    public modalCtrl: ModalController,
  ) {
    this.findingData = this.params.get('findingData');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
  
  openDetailModal(teamId) 
  {
    this.apiService.getTeamById(teamId).
    then((data: any) =>{
      let modalParam = {team: data};
      
      let modal = this.modalCtrl.create(ModalTeamDetail, modalParam);
      modal.present();
    });
  }

  call(number)
  {
    this.apiService.call(number);
  }
}

@Component({
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>
          Lọc tin
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
          <ion-label>Thành Phố</ion-label>
          <ion-select [(ngModel)]="selectedCity" (ngModelChange)="updateDistrict()" cancelText="Cancel" okText="Select">
            <ion-option *ngFor="let city of cities" value="{{city.id}}">{{city.name}}</ion-option>
          </ion-select>
        </ion-item>
        <ion-item>
          <ion-label>Quận/Huyện</ion-label>
          <ion-select multiple="true" [(ngModel)]="selectedDistrict">
            <ion-option *ngFor="let district of districts" value="{{district.id}}">{{district.name}}</ion-option>
          </ion-select>
        </ion-item>
        <ion-item>
          <ion-label>Vị Trí</ion-label>
          <ion-select multiple="true" [(ngModel)]="selectedPosition" >
            <ion-option *ngFor="let position of positions" value="{{position.id}}">{{position.value}}</ion-option>
          </ion-select>
        </ion-item>
        <ion-item>
          <ion-label>Trình</ion-label>
          <ion-select multiple="true" [(ngModel)]="selectedLevel">
            <ion-option *ngFor="let level of levels" value="{{level.id}}">{{level.value}}</ion-option>
          </ion-select>
        </ion-item>
        <ion-fab right bottom>
          <ion-buttons end>
            <button ion-fab color="primary" (click)="filterPlayer()">
              <ion-icon name="send"></ion-icon>
            </button>
          </ion-buttons>
        </ion-fab>
      </ion-list>
    </ion-content>
  `,
})
export class ModalFilterFindingPlayer {
  cities: any;
  districtsByCity: any;
  districts: any;
  positions: any;
  levels: any;

  selectedCity: any;
  selectedDistrict: any;
  selectedPosition: any;
  selectedLevel: any;

  filterData: any;
  notificationSetting: any;

  currentPlayer   : any;
  
  constructor(
    public params: NavParams,
    public viewCtrl: ViewController,
  ) {
    this.levels              = this.params.get('levels');
    this.cities              = this.params.get('cities');
    this.positions           = this.params.get('positions');
    this.districtsByCity     = this.params.get('districtsByCity');
    this.notificationSetting = this.params.get('notificationSetting');

    this.selectedCity     = this.notificationSetting.cityId;
    this.updateDistrict();
    this.selectedLevel    = this.notificationSetting.levelIds;
    this.selectedDistrict = this.notificationSetting.districtIds;
  }

  updateDistrict() 
  {
    if(this.selectedCity) {
      this.districts        = this.districtsByCity[this.selectedCity].districts;
    }
  }

  filterPlayer() 
  {
    let data = {
      'cityId'      : this.selectedCity, 
      'levelIds'    : this.selectedLevel,
      'districtIds' : this.selectedDistrict, 
      'positionIds' : this.selectedPosition, 
    };
    this.viewCtrl.dismiss(data);
  }

  dismiss() 
  {
    this.viewCtrl.dismiss();
  }
}

@Component({
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>
          Đăng tin
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
      <ion-item text-wrap>
        <p>- Tin sẽ hết hạn sau {{this.apiService.expiredDays}} ngày : {{expiredDate}}</p>
        <p>(*) Thông tin cần thiết.</p>
      </ion-item>

      <ion-list>
        <form [formGroup]="findingPlayerForm" (ngSubmit)="logForm()">

          <ion-item-group>
            <ion-item-divider color="light">Địa Điểm</ion-item-divider>
            <ion-item>
              <ion-label stacked>Thành Phố *</ion-label>
              <ion-select formControlName="cityId" [(ngModel)]="selectedCity" (ngModelChange)="updateDistrict()" cancelText="Cancel" okText="Select">
                <ion-option *ngFor="let city of cities" value="{{city.id}}">{{city.name}}</ion-option>
              </ion-select>
            </ion-item>
            <ion-item>
              <ion-label stacked>Quận/Huyện *</ion-label>
              <ion-select formControlName="districtId" >
                <ion-option *ngFor="let district of districts" value="{{district.id}}">{{district.name}}</ion-option>
              </ion-select>
            </ion-item>
            <ion-item>
              <ion-label stacked>Địa chỉ sân</ion-label>
              <ion-input type="text" placeholder="" formControlName="address"></ion-input>
            </ion-item>
          </ion-item-group>

          <ion-item-group>
            <ion-item-divider color="light">Thời gian</ion-item-divider>
            <ion-item>
              <ion-label>Chọn ngày cần tìm:</ion-label>
              <ion-toggle formControlName="isBooked"></ion-toggle>
            </ion-item>
            <ion-item *ngIf="findingPlayerForm.value.isBooked">
              <ion-label stacked>Ngày</ion-label>
              <ion-datetime displayFormat="DDDD, D MMMM" pickerFormat="MMMM D, YYYY" [(min)]="minDate" [(max)]="maxDate" formControlName="matchDate"></ion-datetime>
            </ion-item>
            <ion-item>
              <ion-label stacked>Giờ</ion-label>
              <ion-input type="text" formControlName="matchHour"></ion-input>
            </ion-item>
          </ion-item-group>

          <ion-item-group>
            <ion-item-divider color="light">Cần tìm</ion-item-divider>
              <ion-item>
                <ion-label stacked>Loại Sân *</ion-label>
                <ion-select formControlName="groundTypeId" >
                  <ion-option *ngFor="let groundType of groundTypes" value="{{groundType.id}}">{{groundType.value}}</ion-option>
                </ion-select>
              </ion-item>
              <ion-item>
                <ion-label stacked>Số Lượng</ion-label>
                <ion-input type="number" placeholder="" formControlName="needingNumber"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label stacked>Vị Trí</ion-label>
                <ion-select formControlName="positionId" >
                  <ion-option *ngFor="let position of positions" value="{{position.id}}">{{position.value}}</ion-option>
                </ion-select>
              </ion-item>
              <ion-item>
                <ion-label stacked>Trình</ion-label>
                <ion-select formControlName="levelId" >
                  <ion-option *ngFor="let level of levels" value="{{level.id}}">{{level.value}}</ion-option>
                </ion-select>
              </ion-item>
              <ion-item text-wrap>
                <ion-label stacked>Lời nhắn</ion-label>
                <ion-textarea formControlName="message"></ion-textarea>
              </ion-item>
          </ion-item-group>

          <ion-item-group>
            <ion-item-divider color="light">Liên hệ</ion-item-divider>
            <ion-item>
              <ion-label stacked>Tên</ion-label>
              <ion-input type="text" formControlName="contactName"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label stacked>SĐT</ion-label>
              <ion-input type="number" formControlName="phoneNumber"></ion-input>
            </ion-item>
          </ion-item-group>

        </form>
      </ion-list>
      
      <ion-fab right bottom>
        <ion-buttons end>
          <button ion-fab color="primary" (click)="logForm()" [disabled]="!findingPlayerForm.valid">
            <ion-icon name="send"></ion-icon>
          </button>
        </ion-buttons>
      </ion-fab>
    </ion-content>
  `,
})
export class ModalAddFindingPlayer {
  private findingPlayerForm: FormGroup;
  // data
  cities          : any;
  levels          : any;
  districts       : any;
  positions       : any;
  groundTypes     : any;
  districtsByCity : any;
  
  currentDate     : string;
  expiredDate     : string;
  maxDate         : string;
  minDate         : string;

  filterData      : any;
  selectedCity    : any;

  currentPlayer   : any;

  constructor(
    public params      : NavParams,
    public apiService  : ApiService,
    public viewCtrl    : ViewController,
    public formBuilder : FormBuilder,
  ) {
    let now     = new Date();
    let expired = new Date();
    let max     = new Date();

    expired.setDate(expired.getDate() + this.apiService.expiredDays);
    max.setDate(max.getDate() + this.apiService.aheadDays);
      
    this.minDate     = now.toISOString();
    this.maxDate     = max.toISOString();
    this.currentDate = now.toISOString();
    this.expiredDate = expired.toISOString().substring(0, 10);

    this.levels          = this.params.get('levels');
    this.cities          = this.params.get('cities');
    this.groundTypes     = this.params.get('groundTypes');
    this.positions       = this.params.get('positions');
    this.districtsByCity = this.params.get('districtsByCity');

    this.filterData      = this.params.get('defaultFilterData');
    this.currentPlayer   = this.params.get('currentPlayer');

    this.updateDistrict();

    this.findingPlayerForm = this.formBuilder.group({
      cityId        : [this.filterData.cityId],
      districtId    : [this.filterData.districtIds, Validators.required],
      positionId    : ['', Validators.required],
      levelId       : [this.filterData.levelIds, Validators.required],
      groundTypeId  : [this.filterData.groundTypeId, Validators.required],
      address       : [''],
      message       : [''],
      needingNumber : ['1'],
      isBooked      : [true],
      matchHour     : [''],
      matchDate     : [this.currentDate],
      expiredDate   : [this.expiredDate],
      contactName   : [this.currentPlayer.name],
      phoneNumber   : ['0974796654', Validators.required],
    });
  }

  updateDistrict() 
  {
    if(this.selectedCity) {
      this.districts = this.districtsByCity[this.selectedCity].districts;
    }
  }

  async logForm() 
  {
    this.apiService.handleLoading();
    await this.apiService.addFindingPlayer(this.findingPlayerForm.value)
      .then(data => {
        this.viewCtrl.dismiss(data);
      }, error => console.log(error));
  }
  dismiss() 
  {
    this.viewCtrl.dismiss();
  }
}

