import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FindingPlayerPage } from './finding-player';

@NgModule({
  declarations: [
    FindingPlayerPage,
  ],
  imports: [
    IonicPageModule.forChild(FindingPlayerPage),
  ],
  exports: [
    FindingPlayerPage
  ]
})
export class FindingPlayerPageModule {}
