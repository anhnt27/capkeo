import { Component } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number';
import { NativeStorage } from '@ionic-native/native-storage';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Platform, ModalController, ViewController, AlertController, LoadingController } from 'ionic-angular';

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
  findingMatchs: any;
  cities: any;
  districts: any;
  districtsByCity: any;
  positions: any;
  levels: any;
  properties: any;

  selectedCity: any;
  selectedDistrict: any;
  selectedPosition: any;
  selectedLevel: any;

  filterData: any;
  defaultFilterData: any;
  loading: any;

  constructor(
    public platform: Platform, 
    public navParams: NavParams, 
    public apiService: ApiService,
    public navCtrl: NavController, 
    public modalCtrl: ModalController, 
    public nativeStorage: NativeStorage,
    public loadingCtrl: LoadingController, 
    ) 
  {
    this.createLoading();
  }


async ionViewDidLoad() 
  {
    //will be moved to home.
    this.loading.present();

    this.filterData = this.apiService.getDefaultFilter();
    this.defaultFilterData = this.apiService.getDefaultFilter();

    await this.getLocations();
    await this.getPositions();
    await this.getLevels();
    await this.getAllProperties();

    let findingMatch = this.navParams.get('findingMatch');

    if( findingMatch) {
      this.openDetailModal(findingMatch);
    } 

    await this.getFindingMatchs();

    this.loading.dismiss();
  }
  async doRefresh(refresher)
  {
    console.log('refressing....');
    await this.getFindingMatchs();
    refresher.complete();
  }

  createLoading() 
  {
    this.loading = this.loadingCtrl.create({
      spinner: 'ios',
      dismissOnPageChange: false,
    });
  }
  // get data
  async getFindingMatchs() 
  {
    await this.apiService.getFindingMatchs(this.filterData.districtIds, this.filterData.levelIds).
    then(data => {
      console.log(data);
      this.findingMatchs = data;
    });
  }


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
  async getAllProperties() {
    await this.apiService.getAllProperties()
    .then(data => {
      this.properties = data;
    });
  }

  // open modal
  async openAddModal(){
    let data = {cities: this.cities, districtsByCity: this.districtsByCity, positions: this.positions, levels: this.levels, filterData: this.defaultFilterData};
    let modal = this.modalCtrl.create(ModalAddFindingMatch, data);
    modal.onDidDismiss(data => {
      if(data) {
        let result: any = data;
        if(result.code == 200) {
          this.apiService.presentToast(this.apiService.addedOkMsg);
        } else {
          this.apiService.presentToast(this.apiService.addedOkErr);
        }
      }
      this.getFindingMatchs();
    });


    modal.present();
  }

  openDetailModal(findingMatch) {
    let data = {findingMatch: findingMatch, properties: this.properties};
    let modal = this.modalCtrl.create(ModalFindingMatchDetail, data);
    modal.present();
  }

  openFilterModal() {
    let env = this;
    let data = {cities: this.cities, districtsByCity: this.districtsByCity, positions: this.positions, levels: this.levels, filterData: this.filterData};
    let modal = this.modalCtrl.create(ModalFilterFindingMatch, data);

    modal.onDidDismiss(data => {
     // reload findingMatch with this filter data.
     // should have default filter at the first loading
      if(data) {
        this.createLoading();
        this.loading.present();
        this.filterData = {'cityId': data.cityId, 'districtIds': data.districtIds, 'positionIds': data.positionIds, 'levelIds': data.levelIds};

        this.apiService.getFindingMatchs(data.districtIds, data.levelIds).
        then(data => {
          this.findingMatchs = data;
          this.loading.dismiss();
        }, error => {
          console.log(error);
          this.loading.dismiss();
        });


      }
    });
    modal.present();
  }

  items = [
    { name: 'Manchester United', district: 'Quan 1', phone_number: '0974796654' },
    { name: 'Real Marid', district: 'Quan Go Vap', phone_number: '0909792841' },
    { name: 'Dormund', district: 'Quan 12', phone_number: '0909792841' },
  ];

}



@Component({
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>
          Thong Tin Doi
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
      <ion-grid>
        <ion-row>
          <ion-col col-12>
            <ion-item>
              <ion-label stacked>Ten </ion-label>
              <ion-input value="{{findingMatch.player_name}}" readonly="true"></ion-input>
            </ion-item>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col col-12>
            <ion-item>
              <ion-label>Quan</ion-label>
              <ion-input value="{{findingMatch.district_name}}" readonly="true"></ion-input>
            </ion-item>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col col-12>
            <ion-item>
              <ion-label>San</ion-label>
              <ion-input value="{{findingMatch.address}}" readonly="true"></ion-input>
            </ion-item>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col col-12>
            <ion-item>
              <ion-label>Trinh do</ion-label>
              <ion-input value="{{findingMatch.level_name}}" readonly="true"></ion-input>
            </ion-item>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col col-12>
            <ion-item>
              <ion-label>Loi Nhan</ion-label>
              <ion-input value="{{findingMatch.message}}" readonly="true"></ion-input>
            </ion-item>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col col-10>
            <ion-item>
              <ion-label>Phone</ion-label>
              <ion-input value="{{findingMatch.phone_number}}" readonly="true"><ion-icon name="call" ></ion-icon></ion-input>
            </ion-item>
          </ion-col>
          <ion-col col-2>
            <ion-label stacked></ion-label>
            <button ion-button icon-only color="royal" (click)="call()" small>
              <ion-icon name="call" ></ion-icon>
            </button>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col col-12>
            <ion-buttons>
              <button ion-button icon-only color="royal" small>
                <ion-icon name="person-add"></ion-icon>
              </button>
              Xin Vao Doi!
            </ion-buttons>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  `,
})
export class ModalFindingMatchDetail {
  team;
  findingMatch;
  properties: any;
  constructor(
    public platform : Platform,
    public params   : NavParams,
    public callNumber: CallNumber,
    public viewCtrl : ViewController,
  ) {
    this.properties    = this.params.get('properties');
    this.findingMatch = this.params.get('findingMatch');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
  call()
  {
    alert('calling....');
    this.callNumber.callNumber("0974796654", true)
      .then(() => console.log('Launched dialer!'))
      .catch(() => alert('Error launching dialer'));
  }
}

@Component({
  template: `
    <ion-header>
      <ion-toolbar>
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
        <ion-item>
            <button ion-button full (click)="filterPlayer()">Filter</button>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
})
export class ModalFilterFindingMatch {
  cities: any;
  districtsByCity: any;
  districts: any;
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
    this.levels          = this.params.get('levels');
    this.cities          = this.params.get('cities');
    this.districtsByCity = this.params.get('districtsByCity');
    this.filterData      = this.params.get('filterData');

    this.selectedCity = this.filterData.cityId;
    this.updateDistrict();
    this.selectedLevel = this.filterData.levelIds;
    this.selectedDistrict = this.filterData.districtIds;
  }

  updateDistrict() 
  {
    if(this.selectedCity) {
      this.districts        = this.districtsByCity[this.selectedCity].districts;
    }
  }

  filterPlayer() 
  {
    let data = {'cityId': this.selectedCity, 'districtIds': this.selectedDistrict, 'levelIds': this.selectedLevel};
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
      <ion-toolbar>
        <ion-title>
          Add finding player.
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
      <ion-list>
        <form [formGroup]="findingMatchForm" (ngSubmit)="logForm()">
          <ion-item>
            <ion-label>Thành Phố</ion-label>
            <ion-select formControlName="cityId" [(ngModel)]="selectedCity" (ngModelChange)="updateDistrict()" cancelText="Cancel" okText="Select">
              <ion-option *ngFor="let city of cities" value="{{city.id}}">{{city.name}}</ion-option>
            </ion-select>
          </ion-item>
          <ion-item>
            <ion-label>Quận/Huyện</ion-label>
            <ion-select formControlName="districtIds" >
              <ion-option *ngFor="let district of districts" value="{{district.id}}">{{district.name}}</ion-option>
            </ion-select>
          </ion-item>
          <ion-item>
            <ion-label>Trình</ion-label>
            <ion-select formControlName="levelId" >
              <ion-option *ngFor="let level of levels" value="{{level.id}}">{{level.value}}</ion-option>
            </ion-select>
          </ion-item>
          <ion-item>
            <ion-input type="number" formControlName="phoneNumber" placeholder="Số Điện Thoại"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label floating>Date</ion-label>
            <ion-datetime displayFormat="DDDD MMMM/D" pickerFormat="MMMM D"  (min)="currentDate" formControlName="matchDate"></ion-datetime>
          </ion-item>
          <ion-item>
            <ion-input type="text" placeholder="Giờ" formControlName="matchHour"></ion-input>
          </ion-item>
          <ion-item>
            <ion-input type="text" placeholder="Địa chỉ sân" formControlName="address"></ion-input>
          </ion-item>
          <ion-item>
            <ion-textarea placeholder="Lời nhắn" formControlName="message"></ion-textarea>
          </ion-item>
          <button full ion-button type="submit" [disabled]="!findingMatchForm.valid">Lưu</button>
        </form>
      </ion-list>
    </ion-content>
  `,
})
export class ModalAddFindingMatch {
  private findingMatchForm: FormGroup;
  // data
  cities: any;
  levels: any;
  districts: any;
  currentDate: string;
  districtsByCity: any;

  filterData: any;
  selectedCity: any;

  constructor(
    public params: NavParams,
    public apiService: ApiService,
    public viewCtrl: ViewController,
    public formBuilder: FormBuilder,
  ) {
    this.currentDate     = new Date().toISOString();

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
        console.log('added data ', data);
        this.viewCtrl.dismiss(data);

      }, error => console.log(error));
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
}