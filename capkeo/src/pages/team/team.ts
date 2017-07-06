import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the TeamPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-team',
  templateUrl: 'team.html',
})
export class TeamPage {
  
  tabInformation: any;
  tabMatch: any;
  tabFund: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.tabInformation = TabTeamInformationPage;
    this.tabMatch       = TabTeamMatchPage;
    this.tabFund        = TabTeamFundPage;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TeamPage');
  }

}

@Component({
  template: `
  <ion-content>
    <ion-list>
        <ion-item>
          <ion-label>[Name A] muon gia nhap doi </ion-label>
          <ion-icon (click)="accept()" name="checkbox" item-end></ion-icon>
          <ion-icon (click)="decline()" name="remove-circle" item-end></ion-icon>
        </ion-item>
        <ion-item>
          <ion-label>[Name B] muon gia nhap doi </ion-label>
          <ion-icon (click)="accept()" name="checkbox" item-end></ion-icon>
          <ion-icon (click)="decline()" name="remove-circle" item-end></ion-icon>
        </ion-item>
    </ion-list>

    <ion-list>
        <ion-item>
          <ion-label>Team đã đủ người</ion-label>
          <ion-toggle checked="false"></ion-toggle>
        </ion-item>
        <ion-item>
            <ion-label>Tên đội</ion-label>
            <ion-input type="text"></ion-input>
        </ion-item>
        <ion-item>
            <ion-label>Số Thành Viên</ion-label>
            <ion-input type="number"></ion-input>
        </ion-item>
        <ion-item>
            <ion-label>Quận</ion-label>
            <ion-input type="text" placeholder="Quận hay đá"></ion-input>
        </ion-item>
        <ion-item>
            <ion-label>Thoi gian hoat dong</ion-label>
            <ion-input type="text" placeholder="7h Thứ 6 - 19h - CN"></ion-input>
        </ion-item>
        <ion-item>
            <ion-label>Tuổi trung binh</ion-label>
            <ion-input type="number"></ion-input>
        </ion-item>
        <ion-item>
            <ion-label>Giới Thiệu Đội</ion-label>
            <ion-textarea></ion-textarea>
        </ion-item>
    </ion-list>
  </ion-content>
  `
})
export class TabTeamInformationPage {
  constructor() {}
  accept() 
  {
    alert('accepted');
  }
  decline()
  {
    alert('declined');
  }
}
@Component({
  template: `
  <ion-content>
    <ion-card>
        <ion-card-header>
            Trận đấu
        </ion-card-header>
        <ion-card-content>
            <ion-list>
                <ion-item>
                    <ion-label>Thời gian</ion-label>
                    <ion-input type="text" value="19h 30 - Thứ 2"></ion-input>
                </ion-item>
                <ion-item>
                    <ion-label>Địa Điểm</ion-label>
                    <ion-input type="text" value="Quyết Tâm 2 -  152 Nguyễn Văn Lượng"></ion-input>
                </ion-item>
                <ion-item>
                  <ion-label>Confirm tham gia tran dau</ion-label>
                  <ion-checkbox color="dark" checked="true" item-end></ion-checkbox>
                </ion-item>
            </ion-list>
        </ion-card-content>
    </ion-card>
    <ion-card>
        <ion-card-header>
            Điểm quân
        </ion-card-header>
        <ion-card-content>
            <ion-list>
                <ion-item>
                    <h2>Anh</h2>
                    <p>ok, chiến !</p>
                    <ion-icon name="walk" item-end></ion-icon>
                </ion-item>
                <ion-item>
                    <h2>Tuan</h2>
                    <p>ok, chiến!</p>
                    <ion-icon name="walk" item-end></ion-icon>
                </ion-item>
                <ion-item>
                    <h2>Tai</h2>
                    <p>chở má đi bơi zồi</p>
                    <ion-icon name="woman" item-end></ion-icon>
                </ion-item>
                <ion-item>
                    <h2>Nghia</h2>
                    <p item-end>Chưa hồi âm</p>
                    <ion-icon name="call" item-end small></ion-icon>
                    <ion-icon name="remove" item-end></ion-icon>
                </ion-item>
            </ion-list>
        </ion-card-content>
    </ion-card>
  </ion-content>
  `
})
export class TabTeamMatchPage {
  constructor() {}
}
@Component({
  template: `
  <ion-content>
    <ion-card>
        <ion-card-header>
            Tình hình 
        </ion-card-header>
        <ion-card-content>
            <ion-list>
                <ion-item>
                    <p>Thu</p>
                    <p item-end> 2.000.000 </p>
                </ion-item>
                <ion-item>
                    <p>Chi</p>
                    <p item-end> 200 000 </p>
                </ion-item>
                <ion-item>
                    <p>Tình hình</p>
                    <p item-end> Âm 1 800 000 </p>
                </ion-item>
            </ion-list>
        </ion-card-content>
    </ion-card>
    <ion-card>
        <ion-card-header>
            Thu
        </ion-card-header>
        <ion-card-content>
            <ion-list>
                <ion-item>
                    <p>Tiền sân - Thứ 2 - 16/8/2015</p>
                    <p item-end> 540 000 </p>
                    <ion-icon name="information-circle" item-end></ion-icon>
                </ion-item>
                <ion-item>
                    <p>Tiền sân - Thứ 6 - 19/8/2015</p>
                    <p item-end> 250 000 </p>
                    <ion-icon name="information-circle" item-end></ion-icon>
                </ion-item>
                <ion-item>
                    <p>Tiền sân - Thứ 2 - 23/8/2015</p>
                    <p item-end> 350 000 </p>
                    <p> click oni infor icon, show detail of money and fee from member. Can edit member contribute or not at match tab  </p>
                    <ion-icon name="information-circle" item-end></ion-icon>
                </ion-item>
            </ion-list>
        </ion-card-content>
    </ion-card>
    <ion-card>
        <ion-card-header>
            Thu
        </ion-card-header>
        <ion-card-content>
            <ion-list>
                <ion-item>
                    <h2>Anh</h2>
                    <p>ok, chiến !</p>
                    <p> click oni infor icon, show detail of money and fee from member. match  </p>
                    <ion-icon name="information-circle" item-end></ion-icon>
                </ion-item>
                <ion-item>
                    <h2>Tuan</h2>
                    <p>ok, chiến!</p>
                    <ion-icon name="walk" item-end></ion-icon>
                </ion-item>
                <ion-item>
                    <h2>Tai</h2>
                    <p>chở má đi bơi zồi</p>
                    <ion-icon name="woman" item-end></ion-icon>
                </ion-item>
                <ion-item>
                    <h2>Nghia</h2>
                    <p item-end>Chưa hồi âm</p>
                    <ion-icon name="call" item-end small></ion-icon>
                    <ion-icon name="remove" item-end></ion-icon>
                </ion-item>
            </ion-list>
        </ion-card-content>
    </ion-card>
  </ion-content>
  `
})
export class TabTeamFundPage {
  constructor() {}
}