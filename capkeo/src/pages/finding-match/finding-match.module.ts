import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FindingMatchPage } from './finding-match';

@NgModule({
  declarations: [
    FindingMatchPage,
  ],
  imports: [
    IonicPageModule.forChild(FindingMatchPage),
  ],
  exports: [
    FindingMatchPage
  ]
})
export class FindingMatchPageModule {}
