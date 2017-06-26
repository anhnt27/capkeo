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
import { FindingTeamPage, ModalPlayerDetail, ModalFilterPlayer } from '../pages/finding-team/finding-team';
import { FindingPlayerPage, ModalTeamDetail, ModalFilterTeam } from '../pages/finding-player/finding-player';
import { FindingMatchPage, ModalMatchDetail, ModalFilterMatch } from '../pages/finding-match/finding-match';
import { FindingStadiumPage, ModalStadiumDetail } from '../pages/finding-stadium/finding-stadium';
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
    NotificationPage,
    
    FindingTeamPage,
    ModalPlayerDetail,
    ModalFilterPlayer,

    FindingPlayerPage,
    ModalTeamDetail,
    ModalFilterTeam,

    FindingMatchPage,
    ModalMatchDetail,
    ModalFilterMatch,

    FindingStadiumPage,
    ModalStadiumDetail,

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
    NotificationPage,

    FindingTeamPage,
    ModalPlayerDetail,
    ModalFilterPlayer,
    
    FindingPlayerPage,
    ModalTeamDetail,
    ModalFilterTeam,

    FindingMatchPage,
    ModalMatchDetail,
    ModalFilterMatch,

    FindingStadiumPage,
    ModalStadiumDetail,

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
