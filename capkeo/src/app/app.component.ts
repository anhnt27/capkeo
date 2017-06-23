import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Push, PushObject, PushOptions } from "@ionic-native/push";
import { NativeStorage } from '@ionic-native/native-storage';

import { LoginPage } from '../pages/login/login';
import { PlayerPage } from '../pages/player/player';
import { ListPage } from '../pages/list/list';
import { NotificationPage } from '../pages/notification/notification';

import { PeopleService } from '../providers/people-service/people-service';
import { ApiService } from '../providers/api-service/api-service';


@Component({
  templateUrl: 'app.html',
  providers: [PeopleService, ApiService]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public push: Push,
    public alertCtrl: AlertController,
    public peopleService: PeopleService,
    public apiService: ApiService,
    private nativeStorage: NativeStorage) {

    // this.apiService.sendAuthLogin('anhnt.uit.is@gmail.com', 'Anh');
    // this.apiService.sendRegistrationId('anhnt.uit.is@gmail.com', 'zzyy regist ');
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Thong Bao', component: NotificationPage },
      { title: 'Doi Bong Cua Toi', component: ListPage },
      { title: 'CTTD', component: PlayerPage },
      { title: 'Tim Keo', component: ListPage },
      { title: 'Tim San', component: ListPage },
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      let env = this;

      this.initPushNotification();

      // Here we will check if the user is already logged in
      // because we don't want to ask users to log in each time they open the app
      env.nativeStorage.remove('user');
      env.nav.setRoot(PlayerPage);

      // env.nativeStorage.getItem('user')
      //   .then( function (data) {
      //     // user is previously logged and we have his data
      //     // we will let him access the app
      //     env.nav.setRoot(HomePage);
      //     env.splashScreen.hide();
      //   }, function (error) {
      //     //we don't have the user data so we will ask him to log in
      //     env.nav.setRoot(LoginPage);
      //     env.splashScreen.hide();
      // });

      env.statusBar.styleDefault();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  initPushNotification() {
    if (!this.platform.is('cordova')) {
      console.log("Push notifications not initialized. Cordova is not available - Run in physical device");
      return;
    }
    const options: PushOptions = {
      android: {
        senderID: "546727817471"
      },
      ios: {
        alert: "true",
        badge: false,
        sound: "true"
      },
      windows: {}
    };
    const pushObject: PushObject = this.push.init(options);

    pushObject.on('registration').subscribe((data: any) => {

      //Send device token to server
      this.nativeStorage.setItem('registrationId', { value: data.registrationId })
        .then(
        () => console.log('Stored item!'),
        error => console.error('Error storing item', error)
        );

      // let userEmail = '';
      // this.peopleService.pushRegistrationId(data.registrationId)
      //   .then(data => {
      //     // this.people = data;
      //     // alert( data);
      //   });
    });

    pushObject.on('notification').subscribe((data: any) => {
      alert('message' + data.message);
      //if user using app and push notification comes
      if (data.additionalData.foreground) {
        // if application open, show popup
        let confirmAlert = this.alertCtrl.create({
          title: 'New Notification',
          message: data.message,
          buttons: [{
            text: 'Ignore',
            role: 'cancel'
          }, {
            text: 'View',
            handler: () => {
              //TODO: Your logic here
              // this.nav.push(DetailsPage, {message: data.message});
            }
          }]
        });
        confirmAlert.present();
      } else {
        //if user NOT using app and push notification comes
        //TODO: Your logic on click of push notification directly
        alert(data.message);
        // this.nav.push(DetailsPage, {message: data.message});
        alert("Push notification clicked");
      }
    });

    pushObject.on('error').subscribe(error => alert('Error with Push plugin' + error.message));
  }

}
