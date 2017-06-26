import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Platform, ModalController, ViewController } from 'ionic-angular';

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
})
export class FindingTeamPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public platform: Platform, public modalCtrl: ModalController) {
  }

  openDetailModal(player) {
    let modal = this.modalCtrl.create(ModalPlayerDetail, player);
    modal.present();
  }

  openFilterModal() {
    let modal = this.modalCtrl.create(ModalFilterPlayer);
    modal.present();
  }

  items = [
    { name: 'Mourinho', position: 'coach', district: 'Quan 1' },
    { name: 'Morata', position: 'attack', district: 'Quan 3' },
    { name: 'Pogba', position: 'middle', district: 'Quan 4' },
    { name: 'Mata', position: 'middle', district: 'Quan 5' },
    { name: 'Linderof', position: 'defender', district: 'Quan 12' },
    { name: 'Baily', position: 'defender', district: 'Quan Go Vap' },
  ];
}

@Component({
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>
          Thong Tin Cau Thu
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
              <ion-input value="{{player.name}}" readonly="true"></ion-input>
            </ion-item>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col col-12>
            <ion-item>
              <ion-label stacked>Vi Tri</ion-label>
              <ion-input value="{{player.position}}" readonly="true"></ion-input>
            </ion-item>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col col-10>
            <ion-item>
              <ion-label stacked>Phone</ion-label>
              <ion-input value="0943533543" readonly="true"><ion-icon name="call"></ion-icon></ion-input>
            </ion-item>
          </ion-col>
          <ion-col col-2>
            <ion-label stacked></ion-label>
            <button ion-button icon-only color="royal" small>
              <ion-icon name="call"></ion-icon>
            </button>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col col-12>
            <ion-buttons>
              <button ion-button icon-only color="royal" small>
                <ion-icon name="person-add"></ion-icon>
              </button>
              Moi Vao Doi!
            </ion-buttons>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col col-12>
            <ion-buttons>
              <button ion-button icon-only color="royal" small>
                <ion-icon name="checkbox"></ion-icon>
              </button>
              Chap Nhan Vao Doi
            </ion-buttons>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  `,
})
export class ModalPlayerDetail {
  player;

  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController
  ) {
    this.player = this.params.get('player');
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
          Loc Cau Thu
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
export class ModalFilterPlayer {
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