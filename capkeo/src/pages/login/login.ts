import { Component } from '@angular/core';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { NativeStorage } from '@ionic-native/native-storage';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';

import { NotificationPage } from '../notification/notification';

import { ApiService } from '../../providers/api-service/api-service';

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [ApiService]
})
export class LoginPage {

  FB_APP_ID: number = 1849240425339924;

  constructor(
      public facebook      : Facebook, 
      public apiService    : ApiService,
      public navParams     : NavParams, 
      public googlePlus    : GooglePlus,
      public nativeStorage : NativeStorage,
      public nav           : NavController, 
      public menu          : MenuController,
      ) {
    // this.menu.swipeEnable(false);
    this.facebook.browserInit(this.FB_APP_ID, "v2.8");

    //handle properties right here
    this.getData();
  }

  getData() {
    let env = this;
    this.apiService.getLocations()
    .then(data => {
      env.nativeStorage.setItem('locations', data);
    }, error => console.log(error)
    );

    this.apiService.getProperties('position')
    .then(data => {
      env.nativeStorage.setItem('positions', data);
    }, error => console.log(error)
    );

    this.apiService.getProperties('level')
    .then(data => {
      env.nativeStorage.setItem('levels', data);
    }, error => console.log(error)
    );

    this.apiService.getAllProperties()
    .then(data => {
      env.nativeStorage.setItem('allProperties', data);
    }, error => console.log(error)
    );
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  async doFacebookLogin() {
    let permissions = new Array<string>();
    let env = this;
    //the permissions your facebook app needs from the user
    permissions = ["public_profile"];


    this.facebook.login(permissions).then(function (response) {

      let userId = response.authResponse.userID;
      let params = new Array<string>();
      let accessToken = response.authResponse.accessToken;

      //Getting name and gender properties
      env.facebook.api("/me?fields=name,gender, email", params).then(function (user) {

        user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
        //now we have the users info, let's save it in the NativeStorage
        env.nativeStorage.setItem('user',
        {
          name: user.name,
          email: user.email,
          picture: user.picture,
          accessToken: accessToken,
        })
        .then(
          () => {
            env.apiService.sendAuthLogin(user.email, user.name, accessToken).
            then(data => {
              let result = <any>{};
              result = data;
              if(result.code === 200 ){
                // sucesss
                env.nativeStorage.setItem('jwtToken', result.token);
                // alert('received token' + env.nativeStorage.getItem('jwtToken');
              }
            });
          }, 
          error => {
            console.log(error);
          }
        );
        env.nav.setRoot(NotificationPage);
      })
    }, function (error) {
      console.log(error);
    });
  }

  getUserInfo() {
    // - after succesfully authenticte with Facebook/Google
    // check if user exist ? if not: save data.
    // return token. save token to storage.
    // redirect to Notification pages.



    // Notification constructor
    // load notification first.
    // load properties data -> save to storage.
  }

  /* 
    - how to handle error
    - display error message.  Or just redirect to error page and display message there. restart application.
  */





  doGoogleLogin() {
    let nav = this.nav;
    let env = this;
    // let loading = this.loadingCtrl.create({
    //   content: 'Please wait...'
    // });
    // loading.present();
    this.googlePlus.login({
      'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
      'webClientId': '341120691251-2salj69i0q3n1rbcto8r5ba0lf98q5jq.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
      'offline': true
    })
      .then(function (user) {
        // loading.dismiss();

        env.nativeStorage.setItem('user', {
          name: user.displayName,
          email: user.email,
          picture: user.imageUrl
        })
        .then(function(){
          // env.apiService.sendAuthLogin(user.email, user.name);
          nav.setRoot(NotificationPage);
        }, function (error) {
          console.log(error);
        })
      }, function (error) {
        alert(error);
        console.log(error);
        // loading.dismiss();
      });
  }
}
