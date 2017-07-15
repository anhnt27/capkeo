import { Component } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Platform, ModalController, ViewController } from 'ionic-angular';

import { ModalPlayerDetail } from '../../pages/team/team';

import { ApiService } from '../../providers/api-service/api-service';

/**
 * Generated class for the FindingTeamPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-finding-team',
  templateUrl: 'finding-team.html',
  providers: [ApiService]
})
export class FindingTeamPage {
  findingTeams: any;

  cities: any;
  levels: any;
  positions: any;

  districts: any;
  districtsByCity: any;

  selectedCity: any;
  selectedDistrict: any;
  selectedPosition: any;
  selectedLevel: any;

  filterData: any;
  defaultFilterData: any;

  constructor(
    public platform: Platform, 
    public navParams: NavParams, 
    public apiService: ApiService,
    public navCtrl: NavController, 
    public modalCtrl: ModalController, 
    public nativeStorage: NativeStorage,
    )
  {
  }

  async ionViewDidLoad() 
  {
    if(this.navParams.data) {
      this.cities            = this.navParams.data.cities;
      this.levels            = this.navParams.data.levels;
      this.positions         = this.navParams.data.positions;
      this.districtsByCity   = this.navParams.data.districtsByCity;
      this.defaultFilterData = this.navParams.data.defaultFilterData;
      this.filterData        = this.navParams.data.defaultFilterData;
    } 
    this.apiService.handleLoading();
    await this.getFindingTeams();
  }

  async doRefresh(refresher)
  {
    await this.getFindingTeams();
    refresher.complete();
  }

  async getFindingTeams() 
  {
    await this.apiService.getFindingTeams(this.defaultFilterData.districtId, '0', this.defaultFilterData.levelId).
    then(data => {
      this.findingTeams = data;
    });
  }

  //Modal
  async openAddModal()
  {
    let data = {cities: this.cities, districtsByCity: this.districtsByCity, positions: this.positions, levels: this.levels, filterData: this.defaultFilterData};
    let modal = this.modalCtrl.create(ModalAddFindingTeam, data);
    modal.onDidDismiss((data: any) => {
      if(data) {
        this.apiService.handlePostResult(data.code);
      }
      this.getFindingTeams();
    });

    modal.present();
  }

  openDetailModal(findingTeam) 
  {
    let data = {findingTeam: findingTeam};
    let modal = this.modalCtrl.create(ModalFindingTeamDetail, data);
    modal.present();
  }

  openFilterModal() 
  {
    let data = {cities: this.cities, districtsByCity: this.districtsByCity, positions: this.positions, levels: this.levels, filterData: this.filterData};
    let modal = this.modalCtrl.create(ModalFilterFindingTeam, data);

    modal.onDidDismiss(data => {
      if(data) {
        this.apiService.handleLoading();
        this.filterData = {'cityId': data.cityId, 'districtIds': data.districtIds, 'positionIds': data.positionIds, 'levelIds': data.levelIds};

        this.apiService.getFindingTeams(data.districtIds, data.positionIds, data.levelIds).
        then(data => {
          this.findingTeams = data;
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
      <ion-list>
        <ion-item>
          <label>Tên</label>
          <p item-end>{{findingTeam.player_name}}</p>
        </ion-item>
        <ion-item>
          <label>Quận</label>
          <p item-end>{{findingTeam.district_name}}</p>
        </ion-item>
        <ion-item>
          <label>Vị Trí</label>
          <p item-end>{{findingTeam.position_name}}</p>
        </ion-item>
        <ion-item>
          <label>Trình</label>
          <p item-end>{{findingTeam.level_name}}</p>
        </ion-item>
        <ion-item text-wrap *ngIf="findingTeam.message">
          <h2>Lời nhắn</h2>
          <p>{{findingTeam.message}}</p>
        </ion-item>
        <ion-item>
          <label>SĐT</label>
          <p item-end>{{findingTeam.phone_number}}</p>
          <ion-icon name="call" item-end (click)="call(findingTeam.phone_number)" smaill></ion-icon>
        </ion-item>
        <ion-item>
         <button ion-button clear (click)="openDetailModal(findingTeam.player_id)">Xem thông tin cầu thủ</button>
        </ion-item>
      </ion-list>      
    </ion-content>
  `,
})
export class ModalFindingTeamDetail {
  findingTeam;
  constructor(
    public params     : NavParams,
    public apiService : ApiService,
    public viewCtrl   : ViewController,
    public modalCtrl  : ModalController,
  ) {
    this.findingTeam = this.params.get('findingTeam');
  }

  dismiss() 
  {
    this.viewCtrl.dismiss();
  }

  openDetailModal(playerId) 
  {
    this.apiService.getPlayerById(playerId).
    then((data: any) =>{
      let modalParam = {player: data};
      
      let modal = this.modalCtrl.create(ModalPlayerDetail, modalParam);
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
          Đăng tin tìm đội
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
        <form [formGroup]="findingTeamForm" (ngSubmit)="logForm()">

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
              <ion-select multiple="true" formControlName="districtIds" >
                <ion-option *ngFor="let district of districts" value="{{district.id}}">{{district.name}}</ion-option>
              </ion-select>
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
                <ion-label stacked>Vị Trí *</ion-label>
                <ion-select formControlName="positionId" >
                  <ion-option *ngFor="let position of positions" value="{{position.id}}">{{position.value}}</ion-option>
                </ion-select>
              </ion-item>
              <ion-item>
                <ion-label stacked>Trình *</ion-label>
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
            <button ion-fab color="primary" (click)="logForm()" [disabled]="!findingTeamForm.valid">
              <ion-icon name="send"></ion-icon>
            </button>
          </ion-buttons>
      </ion-fab>
    </ion-content>
  `,
})
export class ModalAddFindingTeam {
  private findingTeamForm: FormGroup;
  // data
  cities          : any;
  levels          : any;
  districts       : any;
  positions       : any;
  districtsByCity : any;

  currentDate     : string;
  expiredDate     : string;
  maxDate         : string;
  minDate         : string;
  
  filterData      : any;
  selectedCity    : any;



  constructor(
    public params: NavParams,
    public apiService: ApiService,
    public viewCtrl: ViewController,
    public formBuilder: FormBuilder,
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
    this.positions       = this.params.get('positions');
    this.districtsByCity = this.params.get('districtsByCity');

    this.filterData      = this.params.get('filterData');

    this.districts = this.districtsByCity[this.filterData.cityId].districts;

    this.findingTeamForm = this.formBuilder.group({
      cityId      : [this.filterData.cityId],
      districtIds : [this.filterData.districtIds, Validators.required],
      positionId  : ['', Validators.required],
      levelId     : [this.filterData.levelIds, Validators.required],
      message     : [''],
      matchHour   : [''],
      matchDate   : [this.currentDate],
      expiredDate : [this.expiredDate],
      phoneNumber : ['0974796654', Validators.required],
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
    await this.apiService.addFindingTeam(this.findingTeamForm.value)
      .then(data => {
        this.viewCtrl.dismiss(data);

      }, error => console.log(error));
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
          Lọc tin tìm đội
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
            <button ion-fab color="primary" (click)="filterTeam()">
              <ion-icon name="send"></ion-icon>
            </button>
          </ion-buttons>
        </ion-fab>
      </ion-list>
    </ion-content>
  `,
})
export class ModalFilterFindingTeam {
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

  constructor(
    public params: NavParams,
    public viewCtrl: ViewController,
  ) {
    this.levels           = this.params.get('levels');
    this.cities           = this.params.get('cities');
    this.positions        = this.params.get('positions');
    this.districtsByCity  = this.params.get('districtsByCity');
    this.filterData       = this.params.get('filterData');
      
    console.log(this.filterData);
    this.selectedCity     = this.filterData.cityId;
    this.updateDistrict();
    // this.selectedPosition = this.filterData.positionIds;
    this.selectedLevel    = this.filterData.levelIds;
    this.selectedDistrict = this.filterData.districtIds;
  }

  updateDistrict() 
  {
    if(this.selectedCity) {
      this.districts        = this.districtsByCity[this.selectedCity].districts;
    }
  }

  filterTeam() 
  {
    let data = {'cityId': this.selectedCity, 'districtIds': this.selectedDistrict, 'positionIds': this.selectedPosition, 'levelIds': this.selectedLevel};
    this.viewCtrl.dismiss(data);
  }

  dismiss() 
  {
    this.viewCtrl.dismiss();
  }
}
