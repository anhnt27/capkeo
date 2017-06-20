import { Component } from '@angular/core';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { HomePage } from '../home/home';

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
})
export class LoginPage {

  FB_APP_ID: number = 1849240425339924;

  constructor(public navCtrl: NavController, public navParams: NavParams, private facebook: Facebook, private googlePlus: GooglePlus) {
    this.facebook.browserInit(this.FB_APP_ID, "v2.8");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  doFacebookLogin(){
    let permissions = new Array<string>();
    let nav = this.navCtrl;
    //the permissions your facebook app needs from the user
    permissions = ["public_profile"];


    let env = this;
    this.facebook.login(permissions).then(function(response){
      let userId = response.authResponse.userID;
      let params = new Array<string>();
      console.log(userId);

      //Getting name and gender properties
      env.facebook.api("/me?fields=name,gender", params).then(function(user) {
        console.log(user);
        alert(user);
        nav.push(HomePage);
        user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
        //now we have the users info, let's save it in the NativeStorage
        // NativeStorage.setItem('user',
        // {
        //   name: user.name,
        //   gender: user.gender,
        //   picture: user.picture
        // })
        // .then(function(){
        //   nav.push(HomePage);
        // }, function (error) {
        //   console.log(error);
        // })
      })
    }, function(error){
    alert(error);
      console.log(error);
    });
  }

    doGoogleLogin(){
      let nav = this.navCtrl;
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
        alert(user);
        nav.push(HomePage);
        // loading.dismiss();

        // // NativeStorage.setItem('user', {
        // //   name: user.displayName,
        // //   email: user.email,
        // //   picture: user.imageUrl
        // // })
        // .then(function(){
        //   nav.push(UserPage);
        // }, function (error) {
        //   console.log(error);
        // })
      }, function (error) {
        alert(error);
        console.log(error);
        // loading.dismiss();
      });
    }
}
