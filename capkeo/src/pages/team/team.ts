import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { ApiService } from '../../providers/api-service/api-service';

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
  providers: [ApiService]
})
export class TeamPage {
  
  tabInformation: any;
  tabMatch: any;
  tabFund: any;

  player: any;
  teamParams: any;

  constructor(
    public navParams: NavParams,
    public apiService: ApiService,
    public navCtrl: NavController, 
    ) 
  {
    this.player = {};
    this.tabInformation = TabTeamInformationPage;
    this.tabMatch       = TabTeamMatchPage;
    this.tabFund        = TabTeamFundPage;


  }

  async ionViewDidLoad() {
    await this.getPlayer();
    console.log('ionViewDidLoad TeamPage');
  }

  async getPlayer()
  {
    await this.apiService.getPlayer()
    .then((data: any) => {
      this.player = data;
      this.teamParams = {player: this.player};
      console.log('prepare param', this.teamParams);
    }, error =>console.log(error)
    );
  }

}

@Component({
  template: `
  <ion-content>
    <ion-card *ngIf="player.team_id">
      <ion-card-header>  
      </ion-card-header>
      <ion-card-content>
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
      </ion-card-content>
    </ion-card>

    <ion-card *ngIf="player.team_id">
      <ion-card-header>  
      </ion-card-header>
      <ion-card-content>
        <ion-list *ngIf="player.team_id">
          <ion-item>
            <ion-label>Is Leader setting</ion-label>
            <ion-toggle [(ngModel)]="isLeader"></ion-toggle>
          </ion-item>

          <ion-item *ngIf="isLeader">
            <ion-label>Team đã đủ người</ion-label>
            <ion-toggle checked="false"></ion-toggle>
          </ion-item>
          <ion-item>
              <ion-label>Tên đội</ion-label>
              <ion-input [disabled]="!isLeader" type="text"></ion-input>
          </ion-item>
          <ion-item>
              <ion-label>Số Thành Viên</ion-label>
              <ion-input [disabled]="!isLeader" type="number"></ion-input>
          </ion-item>
          <ion-item>
              <ion-label>Quận</ion-label>
              <ion-input [disabled]="!isLeader" type="text" placeholder="Quận hay đá"></ion-input>
          </ion-item>
          <ion-item>
              <ion-label>Thoi gian hoat dong</ion-label>
              <ion-input [disabled]="!isLeader" type="text" placeholder="7h Thứ 6 - 19h - CN"></ion-input>
          </ion-item>
          <ion-item>
              <ion-label>Tuổi trung binh</ion-label>
              <ion-input [disabled]="!isLeader" type="number"></ion-input>
          </ion-item>
          <ion-item>
              <ion-label>Giới Thiệu Đội</ion-label>
              <ion-textarea [disabled]="!isLeader"></ion-textarea>
          </ion-item>
        </ion-list>
      </ion-card-content>
    </ion-card>

    <ion-card *ngIf="!player.team_id">
      <ion-card-header>  
      </ion-card-header>
      <ion-card-content>
        <ion-list *ngIf="isLeader">
          <ion-item>
            <ion-input type="text" [(ngModel)]="teamEmail" placeholder="Email của thành viên trong đội bạn muốn vào."></ion-input>
          </ion-item>
          <ion-item>
            <button ion-button (click)="addJoinTeam(teamEmail)">{{joinStatus}}</button>
          </ion-item>
          <ion-item>
            <p>Hoặc,</p>
            <button ion-button (click)="openAddModal()">Lập đội mới</button>
          </ion-item>
        </ion-list>
      </ion-card-content>
    </ion-card>
  </ion-content>
  `
})
export class TabTeamInformationPage {
  isLeader: boolean;
  joinStatus: string;

  cities: any;
  districts: any;
  districtsByCity: any;
  levels: any;

  filterData: any;
  player: any;
  teamEmail: string;
  

  constructor(
    public navParams: NavParams,
    public apiService: ApiService,
    public modalCtrl: ModalController,
    ) 
  {
    this.isLeader = true;
    this.joinStatus = 'Gửi';
    this.player = {};
  }

  async ionViewDidLoad() 
  {
    //will be moved to home.
    this.apiService.handleLoading();
    this.filterData = this.apiService.getDefaultFilter();
    await this.getPlayer();
    await this.getLocations();
    await this.getLevels();
  }
  async getPlayer()
  {
    await this.apiService.getPlayer()
    .then((data: any) => {
      this.player = data;
    }, error =>console.log(error)
    );
  }
  
  getLocations() {
    this.apiService.getLocations()
    .then(data => {
      this.cities = data['results']['cities'];
      this.districtsByCity  = data['results']['districts_by_city'];
    });
  }

  getLevels() {
    this.apiService.getProperties('level')
    .then(data => {
      this.levels = data;
    });
  }

  accept() 
  {
    alert('accepted');
  }
  decline()
  {
    alert('declined');
  }

  addJoinTeam(email)
  {
    this.apiService.handleLoading();
    let join = {email: email};
    this.apiService.addJoinTeam(join)
    .then((data: any) => {
      console.log(data);
      this.apiService.handlePostResult(data.code, data.message);
    }, error => console.log(error));
  }

  openAddModal()
  {
    let data = {cities: this.cities, districtsByCity: this.districtsByCity, levels: this.levels, filterData: this.filterData};
    let modal = this.modalCtrl.create(ModalAddTeam, data);

    modal.onDidDismiss(data => {
      if(data) {
        this.apiService.handleLoading();
      }
    });
    modal.present();
  }
}

@Component({
  template: `
  <ion-content>
    <p> get list of match , push in to select option. Auto select the last one and display</p>

    <ion-list>
      <ion-item>
        <ion-label stacked>Toppings</ion-label>
        <ion-select full [(ngModel)]="toppings" (ngModelChange)="selectMatch()"  cancelText="Nah" okText="Okay!">
          <ion-option value="bacon" selected="true">Bacon</ion-option>
          <ion-option value="olives">Black Olives</ion-option>
          <ion-option value="xcheese">Extra Cheese</ion-option>
          <ion-option value="peppers">Green Peppers</ion-option>
          <ion-option value="mushrooms">Mushrooms</ion-option>
          <ion-option value="onions">Onions</ion-option>
          <ion-option value="pepperoni">Pepperoni</ion-option>
          <ion-option value="pineapple">Pineapple</ion-option>
          <ion-option value="sausage">Sausage</ion-option>
          <ion-option value="Spinach">Spinach</ion-option>
        </ion-select>
      </ion-item>
    </ion-list>

    <button ion-button small full (click)="createMatch()">Lên kèo</button>
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
                </ion-item>
                <ion-item>
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
  player: any;
  constructor(
    public navParams: NavParams,
    ) 
  {
    this.player = this.navParams.data.player
    console.log('param', this.player);
  }
  selectMatch()
  {
    alert('match changed');
  }

  createMatch()
  {
    alert('creating ... match');

  }

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

@Component({
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>
          Add finding player.
        </ion-title>
        <ion-buttons start>
          <button ion-button (click)="dismiss()">
            <span ion-text color="primary" showWhen="ios">Cancel</span>
            <ion-icon name="md-close" showWhen="android,windows"></ion-icon>
          </button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-card>
        <ion-card-content>
          <ion-list>
            <form [formGroup]="teamForm" (ngSubmit)="logForm()">
              <ion-item>
                <ion-label stacked>Thành Phố</ion-label>
                <ion-select formControlName="cityId" [(ngModel)]="selectedCity" (ngModelChange)="updateDistrict()" cancelText="Cancel" okText="Select">
                  <ion-option *ngFor="let city of cities" value="{{city.id}}">{{city.name}}</ion-option>
                </ion-select>
              </ion-item>
              <ion-item>
                <ion-label stacked>Quận/Huyện</ion-label>
                <ion-select formControlName="districtId" >
                  <ion-option *ngFor="let district of districts" value="{{district.id}}">{{district.name}}</ion-option>
                </ion-select>
              </ion-item>
              <ion-item>
                <ion-label stacked>Trình</ion-label>
                <ion-select formControlName="levelId" >
                  <ion-option *ngFor="let level of levels" value="{{level.id}}">{{level.value}}</ion-option>
                </ion-select>
              </ion-item>
              <ion-item>
                <ion-label stacked>Tên Đội</ion-label>
                <ion-input type="text" formControlName="name" placeholder=""></ion-input>
              </ion-item>
              <ion-item>
                <ion-label stacked>Giới Thiệu Đội</ion-label>
                <ion-input type="text" formControlName="message" placeholder=""></ion-input>
              </ion-item>
              <ion-item>
                <ion-label stacked>Tuổi Trung Bình</ion-label>
                <ion-input type="number" formControlName="averageAge" placeholder=""></ion-input>
              </ion-item>
              <ion-item>
                <ion-label stacked>Số Thành Viên</ion-label>
                <ion-input type="number" formControlName="numberOfMember" placeholder=""></ion-input>
              </ion-item>
              <ion-item>
                <ion-label stacked>Thời gian chiến</ion-label>
                <ion-input type="text" formControlName="usualMatchTime" placeholder=""></ion-input>
              </ion-item>
              <button full ion-button type="submit" [disabled]="!teamForm.valid">Lưu</button>
            </form>
          </ion-list>
        </ion-card-content>
      </ion-card>
    </ion-content>
  `,
})
export class ModalAddTeam {
  private teamForm: FormGroup;
  // data
  cities: any;
  levels: any;
  districts: any;
  currentDate: string;
  districtsByCity: any;

  filterData: any;
  selectedCity: any;

  constructor(
    public params: NavParams,
    public apiService: ApiService,
    public viewCtrl: ViewController,
    public formBuilder: FormBuilder,
  ) {
    this.currentDate     = new Date().toISOString();

    this.levels          = this.params.get('levels');
    this.cities          = this.params.get('cities');
    this.districtsByCity = this.params.get('districtsByCity');

    this.filterData      = this.params.get('filterData');

    this.districts = this.districtsByCity[this.filterData.cityId].districts;

    this.teamForm = this.formBuilder.group({
      message         : [''],
      averageAge      : [''],
      numberOfMember  : [''],
      usualMatchTime  : [''],
      isFindingMember : [''],
      cityId          : [this.filterData.cityId],
      name            : ['', Validators.required],
      levelId         : [this.filterData.levelIds],
      districtId      : [this.filterData.districtIds],
    });
  }

  updateDistrict() {
    if(this.selectedCity) {
      this.districts = this.districtsByCity[this.selectedCity].districts;
    }
  }

  async logForm() {
    this.apiService.handleLoading();
    await this.apiService.createTeam(this.teamForm.value)
      .then((data: any) => {
        console.log('added data ', data);
        this.apiService.handlePostResult(data.code);
        this.viewCtrl.dismiss(data);

        // need to reload page with new Team params.

      }, error => console.log(error));
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
}
