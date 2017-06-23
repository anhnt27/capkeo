import { Component } from '@angular/core';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';

import { HomePage } from '../home/home';

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

  constructor(public nav: NavController, 
      public navParams: NavParams, 
      private facebook: Facebook, 
      private googlePlus: GooglePlus,
      private nativeStorage: NativeStorage,
      private apiService: ApiService
      ) {
    this.facebook.browserInit(this.FB_APP_ID, "v2.8");
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

      //Getting name and gender properties
      env.facebook.api("/me?fields=name,gender, email", params).then(function (user) {

        user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
        //now we have the users info, let's save it in the NativeStorage
        env.nativeStorage.setItem('user',
        {
          name: user.name,
          email: user.email,
          picture: user.picture
        })
        .then(
          () => {
            env.apiService.sendAuthLogin(user.email, user.name);
            env.nav.setRoot(HomePage);
          }, 
          error => {
            console.log(error);
          }
        );
      })
    }, function (error) {
      console.log(error);
    });
  }



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
          env.apiService.sendAuthLogin(user.email, user.name);
          nav.setRoot(HomePage);
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
