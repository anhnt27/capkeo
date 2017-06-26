import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Platform, ModalController, ViewController } from 'ionic-angular';

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
})
export class FindingStadiumPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FindingStatiumPage');
  }
  openDetailModal(stadium) {
    let modal = this.modalCtrl.create(ModalStadiumDetail, stadium);
    modal.present();
  }

  items = [
    { name: 'Quyet Tam 2', district: 'Go Vap', phone_number: '0974796654', address: '34 Nguyễn Văn Lượng, 16, Gò Vấp, Hồ Chí Minh' },
    { name: '152', district: 'Go Vap', phone_number: '0909792841', address: '152 Nguyễn Oanh, 17, Gò Vấp, Hồ Chí Minh' },
  ];

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
            <button ion-button icon-only color="royal" small>
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
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController
  ) {
    this.stadium = this.params.get('stadium');
    this.cities = [
      {id: 1, name: 'TP HCM'},
      {id: 2, name: 'Ha Noi'},
      {id: 3, name: 'Da Nang'},
    ];
    this.districts = [
      {id: 1, name: 'Quan 1'},
      {id: 2, name: 'Quan 2'},
      {id: 3, name: 'Quan 3'},
      {id: 4, name: 'Quan 4'},
      {id: 5, name: 'Quan 5'},
      {id: 6, name: 'Quan 6'},
    ];
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}