import { Component } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Platform, ModalController, ViewController, LoadingController } from 'ionic-angular';

import { ApiService } from '../../providers/api-service/api-service';

/**
 * Generated class for the FindingStadiumPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-finding-stadium',
  templateUrl: 'finding-stadium.html',
  providers: [ApiService]
})
export class FindingStadiumPage {
  stadiums: any;
  cities: any;
  districts: any;
  districtsByCity: any;
  
  selectedCity: any;
  selectedDistrict: any;

  loading: any;

  constructor(
    public platform   : Platform, 
    public navParams  : NavParams, 
    public apiService : ApiService, 
    public navCtrl    : NavController, 
    public modalCtrl  : ModalController,
    public loadingCtrl: LoadingController, 
  )
  {
    this.createLoading();
  }

  async ionViewDidLoad() 
  {
    this.loading.present();
    let filterData = this.apiService.getDefaultFilter();
    this.selectedCity = filterData.cityId;

    await this.getLocations();
    await this.updateDistrict();
    this.selectedDistrict = filterData.districtIds;

    await this.getFindingStadiums();
    setTimeout(() => {
      this.loading.dismiss();
    }, 5000);
  }
  
  createLoading() 
  {
    this.loading = this.loadingCtrl.create({
      spinner: 'ios',
      dismissOnPageChange: false,
    });
  }

  updateDistrict() 
  {
    if(this.selectedCity) {
      this.districts = this.districtsByCity[this.selectedCity].districts;
    }
  }
  updateStadium()
  {
    this.createLoading();
    this.loading.present();
    this.getFindingStadiums();
    setTimeout(() => {
      this.loading.dismiss();
    }, 5000);
  }

  async getFindingStadiums()
  {
    await this.apiService.getFindingStadiums(this.selectedDistrict).
    then(data => {
      console.log(data);
      this.stadiums = data;
    });
  }
  async getLocations() 
  {
    await this.apiService.getLocations()
    .then(data => {
      this.cities = data['results']['cities'];
      this.districtsByCity  = data['results']['districts_by_city'];
    });
  }

  openDetailModal(stadium) 
  {
    let modal = this.modalCtrl.create(ModalStadiumDetail, {stadium: stadium});
    modal.present();
  }
}

@Component({
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>
          Thong Tin San
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
              <ion-label stacked>Ten</ion-label>
              <ion-input value="{{stadium.name}}" readonly="true"></ion-input>
            </ion-item>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col col-12>
            <ion-item>
              <ion-label stacked>Dia Chi</ion-label>
              <ion-input value="{{stadium.address}}" readonly="true"></ion-input>
            </ion-item>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col col-10>
            <ion-item>
              <ion-label stacked>Phone</ion-label>
              <ion-input value="{{stadium.phone_number}}" readonly="true"><ion-icon name="call"></ion-icon></ion-input>
            </ion-item>
          </ion-col>
          <ion-col col-2>
            <ion-label stacked></ion-label>
            <button ion-button icon-only color="royal" (click)="call()" small>
              <ion-icon name="call"></ion-icon>
            </button>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  `,
})
export class ModalStadiumDetail {
  stadium;
  districts;
  cities;

  constructor(
    public params: NavParams,
    public callNumber: CallNumber,
    public viewCtrl: ViewController
  ) 
  {
    this.stadium = this.params.get('stadium');
  }

  dismiss() 
  {
    this.viewCtrl.dismiss();
  }

  call()
  {
    this.callNumber.callNumber("0974796654", true)
      .then(() => console.log('Launched dialer!'))
      .catch(() => console.log('Error launching dialer'));
  }
}