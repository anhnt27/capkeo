import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { FindingTeamPage } from '../../pages/finding-team/finding-team';
import { FindingMatchPage } from '../../pages/finding-match/finding-match';
import { FindingPlayerPage } from '../../pages/finding-player/finding-player';
import { FindingStadiumPage } from '../../pages/finding-stadium/finding-stadium';

/**
 * Generated class for the SearchPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  defaultParams: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    console.log('nav Param SearchPage', navParams.data);
    this.defaultParams = navParams.data;
  }

  loadSearchPage(type)
  {
    switch(type)
    {
        case 1:
            this.navCtrl.push(FindingPlayerPage, this.defaultParams);
            break;
        case 2:
            this.navCtrl.push(FindingMatchPage, this.defaultParams);
            break;
        case 3:
            this.navCtrl.push(FindingTeamPage, this.defaultParams);
            break;
        case 4:
            this.navCtrl.push(FindingStadiumPage, this.defaultParams);
            break;
    }
  }

}
