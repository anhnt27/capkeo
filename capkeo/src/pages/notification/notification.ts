import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { NativeStorage } from '@ionic-native/native-storage';

import { ApiService } from '../../providers/api-service/api-service';
/**
 * Generated class for the NotificationPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
  providers: [ApiService]
})
export class NotificationPage {

  email: string;
  registrationId: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private nativeStorage: NativeStorage, private apiService: ApiService) {
    // this.sendRegistrationId();
  }

  items = [
    'A is looking for a match at District 12',
    'B is looking for a team at District 12',
    'C is looking for players at District 12',
  ];

  async sendRegistrationId() {
    let env = this;
    await this.nativeStorage.getItem('user')
      .then(
      data => {
        env.email = data.email;
      },
      error => console.error(error)
      );
    await this.nativeStorage.getItem('registrationId')
      .then(
      data => {
        env.registrationId = data.value
      },
      error => console.error(error)
      );

    // await this.apiService.sendAuthLogin(this.email, this.registrationId);
    await this.apiService.sendRegistrationId(this.email, this.registrationId);

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationPage');
  }

}
