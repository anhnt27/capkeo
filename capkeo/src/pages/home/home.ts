import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';

import { ApiService } from '../../providers/api-service/api-service';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [ApiService]
})
export class HomePage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;	

  email: string;
  registrationId: string;

  constructor(public navCtrl: NavController,  private nativeStorage: NativeStorage, private apiService: ApiService) {
    // this.sendRegistrationId();
  }

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

  ionViewDidLoad(){
    this.loadMap();
  }

  loadMap(){
 
    let latLng = new google.maps.LatLng(10.8828509, 106.7540964);
 
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
 
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }
}
