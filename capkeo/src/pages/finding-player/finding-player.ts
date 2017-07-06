import { Component } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number';
import { NativeStorage } from '@ionic-native/native-storage';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Platform, ModalController, ViewController, LoadingController } from 'ionic-angular';

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
  findingPlayers: any;
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
    /* load data right here:
    - list of finding player
    - list of city/district
    - list of properties data : level / postion
    - 
    */

    
    this.createLoading();
    // this.loading = this.loadingCtrl.create({
    //   spinner: 'ios',
    //   dismissOnPageChange: true,
    // });


    //will be moved to home.
    // this.getLocations();
    // this.getPositions();
    // this.getLevels();
    // this.getAllProperties();

    // this.getFindingPlayers();
    // this.filterData = {'cityId': 1, 'districtIds': [1, 2], 'positionIds': 1, 'levelIds': 7};

    // FOR TEST 
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

    let findingPlayer = this.navParams.get('findingPlayer');

    if( findingPlayer) {
      this.openDetailModal(findingPlayer);
    } 

    await this.getFindingPlayers();

    this.loading.dismiss();
  }
  async doRefresh(refresher)
  {
    console.log('refressing....');
    await this.getFindingPlayers();
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
  async getFindingPlayers() 
  {
    await this.apiService.getFindingPlayers(this.filterData.districtIds,'0', this.filterData.levelIds).
    then(data => {
      console.log(data);
      this.findingPlayers = data;
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

  // get from native - only when run
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

  // open modal
  async openAddModal(){
    let data = {cities: this.cities, districtsByCity: this.districtsByCity, positions: this.positions, levels: this.levels, filterData: this.defaultFilterData};
    let modal = this.modalCtrl.create(ModalAddFindingPlayer, data);
    modal.onDidDismiss(data => {
      if(data) {
        let result: any = data;
        if(result.code == 200) {
          this.apiService.presentToast(this.apiService.addedOkMsg);
        } else {
          this.apiService.presentToast(this.apiService.addedOkErr);
        }
      }
      this.getFindingPlayers();
    });


    modal.present();
  }

  openDetailModal(findingPlayer) {
    let data = {findingPlayer: findingPlayer, properties: this.properties};
    let modal = this.modalCtrl.create(ModalFindingPlayerDetail, data);
    modal.present();
  }

  openFilterModal() {
    let env = this;
    let data = {cities: this.cities, districtsByCity: this.districtsByCity, positions: this.positions, levels: this.levels, filterData: this.filterData};
    let modal = this.modalCtrl.create(ModalFilterFindingPlayer, data);

    modal.onDidDismiss(data => {
     // reload findingPlayer with this filter data.
     // should have default filter at the first loading
      if(data) {
        this.createLoading();
        this.loading.present();
        this.filterData = {'cityId': data.cityId, 'districtIds': data.districtIds, 'positionIds': data.positionIds, 'levelIds': data.levelIds};

        this.apiService.getFindingPlayers(data.districtIds, data.positionIds, data.levelIds).
        then(data => {
          this.findingPlayers = data;
          this.loading.dismiss();
        }, error => {
          console.log(error);
          this.loading.dismiss();
        });


      }
    });
    modal.present();
  }
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
              <ion-input value="{{findingPlayer.player_name}}" readonly="true"></ion-input>
            </ion-item>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col col-12>
            <ion-item>
              <ion-label>Quan</ion-label>
              <ion-input value="{{findingPlayer.district_name}}" readonly="true"></ion-input>
            </ion-item>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col col-12>
            <ion-item>
              <ion-label>San</ion-label>
              <ion-input value="{{findingPlayer.address}}" readonly="true"></ion-input>
            </ion-item>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col col-12>
            <ion-item>
              <ion-label>Vi Tri</ion-label>
              <ion-input value="{{findingPlayer.position_name}}" readonly="true"></ion-input>
            </ion-item>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col col-12>
            <ion-item>
              <ion-label>Trinh do</ion-label>
              <ion-input value="{{findingPlayer.level_name}}" readonly="true"></ion-input>
            </ion-item>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col col-12>
            <ion-item>
              <ion-label>Loi Nhan</ion-label>
              <ion-input value="{{findingPlayer.message}}" readonly="true"></ion-input>
            </ion-item>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col col-10>
            <ion-item>
              <ion-label>Phone</ion-label>
              <ion-input value="{{findingPlayer.phone_number}}" readonly="true"><ion-icon name="call" ></ion-icon></ion-input>
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
export class ModalFindingPlayerDetail {
  team;
  findingPlayer;
  properties: any;
  constructor(
    public platform : Platform,
    public params   : NavParams,
    public callNumber: CallNumber,
    public viewCtrl : ViewController,
  ) {
    this.properties    = this.params.get('properties');
    this.findingPlayer = this.params.get('findingPlayer');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
  call()
  {
    this.callNumber.callNumber("0974796654", true)
      .then(() => console.log('Launched dialer!'))
      .catch(() => console.log('Error launching dialer'));
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
        <ion-item>
            <button ion-button full (click)="filterPlayer()">Filter</button>
        </ion-item>
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

  constructor(
    public params: NavParams,
    public viewCtrl: ViewController,
  ) {
    this.levels          = this.params.get('levels');
    this.cities          = this.params.get('cities');
    this.positions       = this.params.get('positions');
    this.districtsByCity = this.params.get('districtsByCity');
    this.filterData      = this.params.get('filterData');

    this.selectedCity = this.filterData.cityId;
    this.updateDistrict();
    this.selectedPosition = this.filterData.positionIds;
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
    let data = {'cityId': this.selectedCity, 'districtIds': this.selectedDistrict, 'positionIds': this.selectedPosition, 'levelIds': this.selectedLevel};
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
        <form [formGroup]="findingPlayerForm" (ngSubmit)="logForm()">
          <ion-item>
            <ion-label>Thành Phố</ion-label>
            <ion-select formControlName="cityId" [(ngModel)]="selectedCity" (ngModelChange)="updateDistrict()" cancelText="Cancel" okText="Select">
              <ion-option *ngFor="let city of cities" value="{{city.id}}">{{city.name}}</ion-option>
            </ion-select>
          </ion-item>
          <ion-item>
            <ion-label>Quận/Huyện</ion-label>
            <ion-select formControlName="districtId" >
              <ion-option *ngFor="let district of districts" value="{{district.id}}">{{district.name}}</ion-option>
            </ion-select>
          </ion-item>
          <ion-item>
            <ion-label>Vị Trí</ion-label>
            <ion-select formControlName="positionId" >
              <ion-option *ngFor="let position of positions" value="{{position.id}}">{{position.value}}</ion-option>
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
            <ion-input type="number" placeholder="Số Lượng" formControlName="needingNumber"></ion-input>
          </ion-item>
          <ion-item>
            <ion-input type="text" placeholder="Địa chỉ sân" formControlName="address"></ion-input>
          </ion-item>
          <ion-item>
            <ion-textarea placeholder="Lời nhắn" formControlName="message"></ion-textarea>
          </ion-item>
          <button full ion-button type="submit" [disabled]="!findingPlayerForm.valid">Lưu</button>
        </form>
      </ion-list>
    </ion-content>
  `,
})
export class ModalAddFindingPlayer {
  private findingPlayerForm: FormGroup;
  // data
  cities: any;
  levels: any;
  districts: any;
  positions: any;
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
    this.positions       = this.params.get('positions');
    this.districtsByCity = this.params.get('districtsByCity');

    this.filterData      = this.params.get('filterData');

    this.districts = this.districtsByCity[this.filterData.cityId].districts;

    this.findingPlayerForm = this.formBuilder.group({
      cityId        : [this.filterData.cityId],
      districtId    : [this.filterData.districtIds, Validators.required],
      positionId    : ['', Validators.required],
      levelId       : [this.filterData.levelIds, Validators.required],
      address       : [''],
      message       : [''],
      needingNumber : [''],
      matchHour     : [''],
      matchDate     : [this.currentDate],
      phoneNumber   : ['0974796654', Validators.required],
    });
    // this.findingPlayerForm.controls['cityId'].setValue(this.filterData.cityId);
    // this.findingPlayerForm.group.cityId = this.filterData.cityId;

  }
  updateDistrict() {
    if(this.selectedCity) {
      this.districts = this.districtsByCity[this.selectedCity].districts;
    }
  }
  async logForm() {
    await this.apiService.addFindingPlayer(this.findingPlayerForm.value)
      .then(data => {
        console.log('added data ', data);
        this.viewCtrl.dismiss(data);

      }, error => console.log(error));
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
}