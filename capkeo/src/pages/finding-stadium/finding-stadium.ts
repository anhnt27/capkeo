import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Platform, ModalController, ViewController } from 'ionic-angular';

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

  constructor(
    public platform   : Platform, 
    public navParams  : NavParams, 
    public apiService : ApiService, 
    public navCtrl    : NavController, 
    public modalCtrl  : ModalController,
  )
  {
  }

  async ionViewDidLoad() 
  {
    this.apiService.handleLoading();
    let filterData = this.apiService.getDefaultFilter();
    this.selectedCity = filterData.cityId;

    await this.getLocations();
    await this.updateDistrict();
    this.selectedDistrict = filterData.districtIds;
    await this.getFindingStadiums();
  }
  

  updateDistrict() 
  {
    if(this.selectedCity) {
      this.districts = this.districtsByCity[this.selectedCity].districts;
    }
  }
  updateStadium()
  {
    this.apiService.handleLoading();
    this.getFindingStadiums();
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
      <ion-toolbar color="primary">
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
      <ion-card>
        <ion-card-header>  
        </ion-card-header>
        <ion-card-content>
          <ion-list>
            <ion-item>
              <h2>Tên</h2>
              <p>{{stadium.name}}</p>
            </ion-item>
            <ion-item>
              <h2>Địa Chỉ</h2>
              <p>{{stadium.address}}</p>
            </ion-item>
            <ion-item>
              <h2>SĐT</h2>
              <p>{{stadium.phone_number}}</p>
              <ion-icon item-end name="call" (click)="call(stadium.phone_number)"></ion-icon>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>
    </ion-content>
  `,
})
export class ModalStadiumDetail {
  stadium;
  districts;
  cities;

  constructor(
    public params: NavParams,
    public apiService: ApiService,
    public viewCtrl: ViewController,
  ) 
  {
    this.stadium = this.params.get('stadium');
  }

  dismiss() 
  {
    this.viewCtrl.dismiss();
  }

  call(phoneNumber)
  {
    this.apiService.call(phoneNumber);
  }
}