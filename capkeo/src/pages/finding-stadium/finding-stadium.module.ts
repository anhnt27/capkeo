import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FindingStadiumPage } from './finding-stadium';

@NgModule({
  declarations: [
    FindingStadiumPage,
  ],
  imports: [
    IonicPageModule.forChild(FindingStadiumPage),
  ],
  exports: [
    FindingStadiumPage
  ]
})
export class FindingStadiumPageModule {}
