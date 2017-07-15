import { Component } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Platform, ModalController, ViewController } from 'ionic-angular';

import { ModalTeamDetail } from '../../pages/team/team';

import { ApiService } from '../../providers/api-service/api-service';

/**
 * Generated class for the FindingMatchPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-finding-match',
  templateUrl: 'finding-match.html',
  providers: [ApiService]
})
export class FindingMatchPage {
  findingMatchs     : any;
  cities            : any;
  districts         : any;
  districtsByCity   : any;
  levels            : any;
  
  selectedCity      : any;
  selectedDistrict  : any;
  selectedLevel     : any;
  
  filterData        : any;
  defaultFilterData : any;

  constructor(
    public platform      : Platform, 
    public navParams     : NavParams, 
    public apiService    : ApiService,
    public navCtrl       : NavController, 
    public nativeStorage : NativeStorage,
    public modalCtrl     : ModalController, 
    ) 
  {
  }


async ionViewDidLoad() 
  {
    if(this.navParams.data) {
      this.cities            = this.navParams.data.cities;
      this.levels            = this.navParams.data.levels;
      this.districtsByCity   = this.navParams.data.districtsByCity;
      this.defaultFilterData = this.navParams.data.defaultFilterData;
      this.filterData        = this.navParams.data.defaultFilterData;
    } 

    //will be moved to home.
    this.apiService.handleLoading();
    await this.getFindingMatchs();
  }
  async doRefresh(refresher)
  {
    await this.getFindingMatchs();
    refresher.complete();
  }

  // get data
  async getFindingMatchs() 
  {
    await this.apiService.getFindingMatchs(this.filterData.districtIds, this.filterData.levelIds).
    then(data => {
      this.findingMatchs = data;
    });
  }

  // open modal
  async openAddModal(){
    let data = {cities: this.cities, districtsByCity: this.districtsByCity, levels: this.levels, filterData: this.defaultFilterData};
    let modal = this.modalCtrl.create(ModalAddFindingMatch, data);
    modal.onDidDismiss((data: any) => {
      if(data) {
        this.apiService.handlePostResult(data.code);
      }
      this.getFindingMatchs();
    });


    modal.present();
  }

  openDetailModal(findingMatch) {
    let data  = {findingMatch: findingMatch};
    let modal = this.modalCtrl.create(ModalFindingMatchDetail, data);
    modal.present();
  }

  openFilterModal() {
    let data = {cities: this.cities, districtsByCity: this.districtsByCity, levels: this.levels, filterData: this.filterData};
    let modal = this.modalCtrl.create(ModalFilterFindingMatch, data);

    modal.onDidDismiss(data => {
     // reload findingMatch with this filter data.
     // should have default filter at the first loading
      if(data) {
        this.apiService.handleLoading();
        this.filterData = {'cityId': data.cityId, 'districtIds': data.districtIds, 'levelIds': data.levelIds};

        this.apiService.getFindingMatchs(data.districtIds, data.levelIds).
        then(data => {
          this.findingMatchs = data;
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
      <ion-item>
        <label>Tên</label>
        <p item-end>{{findingMatch.player_name}}</p>
      </ion-item>
      <ion-item>
        <label>Quận</label>
        <p item-end>{{findingMatch.district_name}}</p>
      </ion-item>
      <ion-item>
        <label>Địa Chỉ</label>
        <p item-end>{{findingMatch.address}}</p>
      </ion-item>
      <ion-item>
        <label>Trình</label>
        <p item-end>{{findingMatch.level_name}}</p>
      </ion-item>
      <ion-item text-wrap *ngIf="findingMatch.message">
        <h2>Lời nhắn</h2>
        <p>{{findingMatch.message}}</p>
      </ion-item>
      <ion-item>
        <label>SĐT</label>
        <p item-end>{{findingMatch.phone_number}}</p>
        <ion-icon name="call" item-end (click)="call(findingMatch.phone_number)" smaill></ion-icon>
      </ion-item>
      <ion-item>
        <label>Chi tiết đội bóng</label>
        <button ion-button clear item-end (click)="openDetailModal(findingMatch.team_id)">Xem</button>
      </ion-item>
    </ion-content>
  `,
})
export class ModalFindingMatchDetail {
  team;
  findingMatch;
  
  constructor(
    public params     : NavParams,
    public apiService : ApiService,
    public viewCtrl   : ViewController,
    public modalCtrl  : ModalController,
  ) {
    this.findingMatch = this.params.get('findingMatch');
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
          <ion-label>Trình</ion-label>
          <ion-select multiple="true" [(ngModel)]="selectedLevel">
            <ion-option *ngFor="let level of levels" value="{{level.id}}">{{level.value}}</ion-option>
          </ion-select>
        </ion-item>
        <ion-fab right bottom>
          <ion-buttons end>
            <button ion-fab color="primary" (click)="filterMatch()">
              <ion-icon name="send"></ion-icon>
            </button>
          </ion-buttons>
        </ion-fab>
      </ion-list>
    </ion-content>
  `,
})
export class ModalFilterFindingMatch {
  cities           : any;
  districtsByCity  : any;
  districts        : any;
  levels           : any;
  
  selectedCity     : any;
  selectedDistrict : any;
  selectedLevel    : any;
  
  filterData       : any;

  constructor(
    public params     : NavParams,
    public apiService : ApiService,
    public viewCtrl   : ViewController,
  ) {
    this.levels           = this.params.get('levels');
    this.cities           = this.params.get('cities');
    this.districtsByCity  = this.params.get('districtsByCity');
    this.filterData       = this.params.get('filterData');
    
    this.selectedCity     = this.filterData.cityId;
    this.updateDistrict();
    this.selectedLevel    = this.filterData.levelIds;
    this.selectedDistrict = this.filterData.districtIds;
  }

  updateDistrict() 
  {
    if(this.selectedCity) {
      this.districts        = this.districtsByCity[this.selectedCity].districts;
    }
  }

  filterMatch() 
  {
    let data = {
      'cityId'      : this.selectedCity, 
      'districtIds' : this.selectedDistrict, 
      'levelIds'    : this.selectedLevel,
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
        <form [formGroup]="findingMatchForm" (ngSubmit)="logForm()">
          <ion-item-group>
            <ion-item-divider color="light">Địa Điểm</ion-item-divider>
            <ion-item>
              <ion-label stacked>Thành Phố</ion-label>
              <ion-select formControlName="cityId" [(ngModel)]="selectedCity" (ngModelChange)="updateDistrict()" cancelText="Cancel" okText="Select">
                <ion-option *ngFor="let city of cities" value="{{city.id}}">{{city.name}}</ion-option>
              </ion-select>
            </ion-item>
            <ion-item>
              <ion-label stacked>Quận/Huyện</ion-label>
              <ion-select formControlName="districtIds" >
                <ion-option *ngFor="let district of districts" value="{{district.id}}">{{district.name}}</ion-option>
              </ion-select>
            </ion-item>
            <ion-item>
              <ion-label stacked>Địa chỉ sân</ion-label>
              <ion-input type="text" formControlName="address"></ion-input>
            </ion-item>
          </ion-item-group>
          
          <ion-item-group>
            <ion-item-divider color="light">Thời gian</ion-item-divider>
            <ion-item>
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
              <ion-label stacked>SĐT</ion-label>
              <ion-input type="number" formControlName="phoneNumber"></ion-input>
            </ion-item>
          </ion-item-group>
        </form>
      </ion-list>

      <ion-fab right bottom>
          <ion-buttons end>
            <button ion-fab color="primary" (click)="logForm()" [disabled]="!findingMatchForm.valid">
              <ion-icon name="send"></ion-icon>
            </button>
          </ion-buttons>
      </ion-fab>

    </ion-content>
  `,
})
export class ModalAddFindingMatch {
  private findingMatchForm : FormGroup;
  // data
    cities          : any;
    levels          : any;
    districts       : any;
    districtsByCity : any;

    currentDate     : string;
    expiredDate     : string;
    maxDate         : string;
    minDate         : string;
    
    filterData      : any;
    selectedCity    : any;

  constructor(
    public params      : NavParams,
    public apiService  : ApiService,
    public formBuilder : FormBuilder,
    public viewCtrl    : ViewController,
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
    this.districtsByCity = this.params.get('districtsByCity');

    this.filterData      = this.params.get('filterData');

    this.districts = this.districtsByCity[this.filterData.cityId].districts;

    this.findingMatchForm = this.formBuilder.group({
      cityId        : [this.filterData.cityId],
      districtIds    : [this.filterData.districtIds, Validators.required],
      levelId       : [this.filterData.levelIds, Validators.required],
      address       : [''],
      message       : [''],
      matchHour     : [''],
      matchDate     : [this.currentDate],
      expiredDate   : [this.expiredDate],
      phoneNumber   : ['0974796654', Validators.required],
    });

  }
  updateDistrict() {
    if(this.selectedCity) {
      this.districts = this.districtsByCity[this.selectedCity].districts;
    }
  }
  async logForm() {
    await this.apiService.addFindingMatch(this.findingMatchForm.value)
      .then(data => {
        this.viewCtrl.dismiss(data);
      }, error => console.log(error));
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
}