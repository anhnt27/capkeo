import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FindingTeamPage } from './finding-team';

@NgModule({
  declarations: [
    FindingTeamPage,
  ],
  imports: [
    IonicPageModule.forChild(FindingTeamPage),
  ],
  exports: [
    FindingTeamPage
  ]
})
export class FindingTeamPageModule {}
