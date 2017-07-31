import { Tabs } from 'ionic-angular';
import { NavController, Events  } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { Component, ViewChild, ElementRef } from '@angular/core';

import { ApiService } from '../../providers/api-service/api-service';

import { TeamPage } from '../../pages/team/team';
import { SearchPage } from '../../pages/search/search';
import { SettingPage } from '../../pages/setting/setting';
import { NotificationPage } from '../../pages/notification/notification';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [ApiService]
})
export class HomePage {
  @ViewChild('myTabs') tabRef: Tabs;

  @ViewChild('map') mapElement: ElementRef;

  isReady : boolean = false;
  map     : any;	

  //tabs
  tabNotification : any;
  tabTeam         : any;
  tabSearch       : any;
  tabSetting      : any;
  
  email           : string;
  registrationId  : string;
  
  // param to tabs
  defaultParams   : any;

  cities               : any;
  districts            : any;
  districtsByCity      : any;
  levels               : any;
  positions            : any;
  groundTypes          : any;
  defaultFilterData    : any;
  currentPlayer        : any;


  loading: any;

  unread: string = "";


  constructor(
    public events        : Events, 
    public apiService    : ApiService,
    public navCtrl       : NavController,  
    public nativeStorage : NativeStorage, 
    ) 
  {
    
    this.tabTeam         = TeamPage;
    this.tabSearch       = SearchPage;
    this.tabSetting      = SettingPage;
    this.tabNotification = NotificationPage;


    events.subscribe('read:notification', () => {
      let unreadNumber = parseInt(this.unread);
      unreadNumber --;
      if(unreadNumber == 0) this.unread ="";
      else this.unread = unreadNumber.toString();

    });

    events.subscribe('player:acceptInvite', () => {
      this.ionViewDidLoad();
      this.tabRef.select(0);
    });

    events.subscribe('profile:updated', () => {
      this.tabRef.select(0);
      this.ionViewDidLoad();
    });


  }

  ionViewDidEnter() {
    // this.tabRef.select(1);

   }

  async ionViewDidLoad()
  {
    this.loading = this.apiService.handleLoading(10000);

    if(! this.apiService.isTesting) {
      this.sendRegistrationId();
    }
    
    await this.countUnreadNotifications()

    await this.getLocations();
    await this.getLevels();
    await this.getPositions();
    await this.getGroundTypes();
    await this.getPlayer();

    this.defaultParams = {
      cities            : this.cities, 
      levels            : this.levels, 
      positions         : this.positions,
      groundTypes       : this.groundTypes,
      currentPlayer     : this.currentPlayer,
      districtsByCity   : this.districtsByCity, 
      defaultFilterData : this.defaultFilterData,
    };
    console.log('nav Param HomePage', this.defaultParams);
  }

  async getLocations() 
  {
    await this.apiService.getLocations()
    .then(data => {
      this.cities = data['results']['cities'];
      this.districtsByCity  = data['results']['districts_by_city'];
    });
  }

  async getLevels() 
  {
    await this.apiService.getProperties('level')
    .then(data => {
      this.levels = data;
    });
  }

  async getPositions() {
    await this.apiService.getProperties('position')
    .then(data => {
      this.positions = data;
    });
  }

  async getGroundTypes() {
    await this.apiService.getProperties('ground_type')
    .then(data => {
      this.groundTypes = data;
    });
  }

  async getPlayer()
  {
    await this.apiService.getPlayer()
    .then((data: any) => {
      this.currentPlayer = data;

      this.defaultFilterData = {cityId: data.city_id, districtIds: data.district_id, levelIds: data.level_id, positionIds: data.position_id, groundTypeId: data.ground_type_id};
    }, error =>console.log(error)
    );
  }

  countUnreadNotifications()
  {
    this.apiService.countUnreadNotifications().
    then((data: any) => {
      this.unread = data;

      let unreadNumber = parseInt(this.unread);
      if(unreadNumber == 0) this.unread ="";
      this.isReady = true;
    }, error => console.log(error))
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





