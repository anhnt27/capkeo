import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { Push } from "@ionic-native/push";
import { HttpModule } from '@angular/http';
import { NativeStorage } from '@ionic-native/native-storage';
import { CallNumber } from '@ionic-native/call-number';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { TeamPage, TabTeamFundPage, ModalAddTeam, ModalUpdateTeam, ModalAddMatch, ModalTeamDetail, ModalPlayerDetail } from '../pages/team/team';
import { FindingTeamPage, ModalAddFindingTeam, ModalFindingTeamDetail, ModalFilterFindingTeam } from '../pages/finding-team/finding-team';
import { FindingPlayerPage, ModalFindingPlayerDetail, ModalFilterFindingPlayer, ModalAddFindingPlayer } from '../pages/finding-player/finding-player';
import { FindingMatchPage, ModalFindingMatchDetail, ModalFilterFindingMatch, ModalAddFindingMatch } from '../pages/finding-match/finding-match';
import { FindingStadiumPage, ModalStadiumDetail } from '../pages/finding-stadium/finding-stadium';
import { NotificationPage } from '../pages/notification/notification';
import { SettingPage, FindingPlayerSettingModal } from '../pages/setting/setting';
import { SearchPage } from '../pages/search/search';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ApiService } from '../providers/api-service/api-service';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    HomePage,
    NotificationPage,
    
    FindingTeamPage,
    ModalAddFindingTeam,
    ModalFindingTeamDetail,
    ModalFilterFindingTeam,

    FindingPlayerPage,
    ModalFindingPlayerDetail,
    ModalFilterFindingPlayer,
    ModalAddFindingPlayer,

    FindingMatchPage,
    ModalFindingMatchDetail,
    ModalFilterFindingMatch,
    ModalAddFindingMatch,

    FindingStadiumPage,
    ModalStadiumDetail,

    TeamPage,
    TabTeamFundPage,
    ModalAddTeam,
    ModalUpdateTeam, 
    ModalAddMatch,
    ModalTeamDetail,
    ModalPlayerDetail,


    SettingPage,
    SearchPage,
    FindingPlayerSettingModal,

  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
        monthNames: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6','Tháng 7' ,'Tháng 8', 'Tháng 9', 'Tháng 10' ,'Tháng 11', 'Tháng 12'],
        dayNames: ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
    }),
    HttpModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    HomePage,
    NotificationPage,

    FindingTeamPage,
    ModalAddFindingTeam,
    ModalFindingTeamDetail,
    ModalFilterFindingTeam,
    
    FindingPlayerPage,
    ModalFindingPlayerDetail,
    ModalFilterFindingPlayer,
    ModalAddFindingPlayer,

    FindingMatchPage,
    ModalFindingMatchDetail,
    ModalFilterFindingMatch,
    ModalAddFindingMatch,

    FindingStadiumPage,
    ModalStadiumDetail,

    TeamPage,
    TabTeamFundPage,
    ModalAddTeam,
    ModalUpdateTeam, 
    ModalAddMatch,
    ModalTeamDetail,
    ModalPlayerDetail,

    
    SettingPage,
    SearchPage,
    FindingPlayerSettingModal,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Facebook,
    GooglePlus,
    Push,
    NativeStorage,
    CallNumber,

    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ApiService,
  ]
})
export class AppModule { }
