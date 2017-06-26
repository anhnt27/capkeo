import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Platform, ModalController, ViewController } from 'ionic-angular';

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
})
export class FindingMatchPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FindingMatchPage');
  }
  openDetailModal(match) {
    let modal = this.modalCtrl.create(ModalMatchDetail, match);
    modal.present();
  }

  openFilterModal() {
    let modal = this.modalCtrl.create(ModalFilterMatch);
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
          Thong Tin Keo
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
              <ion-input value="{{match.name}}" readonly="true"></ion-input>
            </ion-item>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col col-12>
            <ion-item>
              <ion-label stacked>Quan</ion-label>
              <ion-input value="{{match.district}}" readonly="true"></ion-input>
            </ion-item>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col col-10>
            <ion-item>
              <ion-label stacked>Phone</ion-label>
              <ion-input value="{{match.phone_number}}" readonly="true"><ion-icon name="call"></ion-icon></ion-input>
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
export class ModalMatchDetail {
  match;

  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController
  ) {
    this.match = this.params.get('match');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}

@Component({
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>
          Filter Player
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
          <ion-range dualKnobs="true" pin="true" [(ngModel)]="structure" color="dark">
            <ion-icon range-left small name="brush"></ion-icon>
            <ion-icon range-right name="brush"></ion-icon>
          </ion-range>
        </ion-item>
        <ion-item>
          <ion-label>District</ion-label>
          <ion-select [(ngModel)]="toppings" multiple="true" cancelText="Nah" okText="Okay!">
            <ion-option *ngFor="let district of districts" value="{{district.id}}">{{district.name}}</ion-option>
          </ion-select>
        </ion-item>
        <ion-item>
          <ion-label>Vi Tri</ion-label>
          <ion-select [(ngModel)]="toppings" multiple="true" cancelText="Nah" okText="Okay!">
            <ion-option *ngFor="let district of districts" value="{{district.id}}">{{district.name}}</ion-option>
          </ion-select>
        </ion-item>
        <ion-item>
          <ion-label>Trinh Do</ion-label>
          <ion-select [(ngModel)]="toppings" multiple="true" cancelText="Nah" okText="Okay!">
            <ion-option *ngFor="let district of districts" value="{{district.id}}">{{district.name}}</ion-option>
          </ion-select>
        </ion-item>
        
      </ion-list>
    </ion-content>
  `,
})
export class ModalFilterMatch {
  structure: any = { lower: 33, upper: 60 };
  districts;
  

  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController
  ) {
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
    // alert(this.)
    this.viewCtrl.dismiss();
  }
}