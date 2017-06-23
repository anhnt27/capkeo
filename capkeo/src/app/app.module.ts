import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { Push } from "@ionic-native/push";
import { HttpModule } from '@angular/http';
import { NativeStorage } from '@ionic-native/native-storage';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { PlayerPage, ModalPlayerDetail, ModalFilterPlayer } from '../pages/player/player';
import { NotificationPage } from '../pages/notification/notification';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { PeopleService } from '../providers/people-service/people-service';
import { ApiService } from '../providers/api-service/api-service';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    HomePage,
    ListPage,
    PlayerPage,
    ModalPlayerDetail,
    ModalFilterPlayer,
    NotificationPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    HomePage,
    ListPage,
    PlayerPage,
    ModalPlayerDetail,
    ModalFilterPlayer,
    NotificationPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Facebook,
    GooglePlus,
    Push,
    NativeStorage,

    PeopleService,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ApiService
  ]
})
export class AppModule { }
