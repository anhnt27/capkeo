import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Platform, ModalController, ViewController } from 'ionic-angular';

/**
 * Generated class for the PlayerPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-player',
  templateUrl: 'player.html',
})
export class PlayerPage {
  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public modalCtrl: ModalController) {
  }

  openDetailModal(player) {
    // let modal = this.modalCtrl.create(ModalPlayerDetail, player);
    // modal.present();
  }

  openFilterModal() {
    // let modal = this.modalCtrl.create(ModalFilterPlayer);
    // modal.present();
  }

  items = [
    { name: 'Mourinho', position: 'coach', district: 'Quan 1' },
    { name: 'Morata', position: 'attack', district: 'Quan 3' },
    { name: 'Pogba', position: 'middle', district: 'Quan 4' },
    { name: 'Mata', position: 'middle', district: 'Quan 5' },
    { name: 'Linderof', position: 'defender', district: 'Quan 12' },
    { name: 'Baily', position: 'defender', district: 'Quan Go Vap' },
  ];

  itemSelected(item: string) {
    console.log("Selected Player", item);
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad PlayerPage');
  }
}

