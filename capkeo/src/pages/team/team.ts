import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { IonicPage, NavController, NavParams, ViewController, ModalController, AlertController, Events } from 'ionic-angular';

import { ApiService } from '../../providers/api-service/api-service';

/**
 * Generated class for the TeamPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector    : 'page-team',
  templateUrl : 'team.html',
  providers   : [ApiService]
})
export class TeamPage {
  tabFund              : any;
  
  cities               : any;
  districts            : any;
  districtsByCity      : any;
  levels               : any;
  
  filterData           : any;
  defaultFilterData    : any;
  
  currentPlayer        : any;
  teamParams           : any;
  teamSegment          : string;
  
  //from info tab
  isLeader             : boolean;
  joinStatus           : string;
  
  team                 : any;
  joiningRequests      : any;
  inviteRequests        : any;
  teamEmail            : string;
  isDataLoaded         : boolean;
  
  // match tab
  matches              : any;
  selectedMatch        : any;
  confirmStatusData    : any;
  confirmStatus        : any;
  selectedMatchPlayers : any;
  selectedMatchId      : number;

  // players tab
  teamPlayers : any;


  constructor(
    public events     : Events, 
    public navParams  : NavParams,
    public apiService : ApiService,
    public navCtrl    : NavController, 
    public alertCtrl  : AlertController,
    public modalCtrl  : ModalController,
    ) 
  {
    this.teamSegment       = "matches";
    this.tabFund           = TabTeamFundPage;
    
    // info tab
    this.isLeader          = false;
    this.joinStatus        = 'Gửi';
    this.currentPlayer     = {};
    this.team              = {};
    this.teamPlayers       = [];
    this.isDataLoaded      = false;
    // match tab
    this.selectedMatch     = {};
    this.confirmStatusData = {};
    this.isDataLoaded      = true;


    // get param
    this.cities            = navParams.data.cities;
    this.levels            = navParams.data.levels;
    this.currentPlayer     = navParams.data.currentPlayer;
    this.districtsByCity   = navParams.data.districtsByCity;
    this.defaultFilterData = navParams.data.defaultFilterData;
    this.filterData        = navParams.data.defaultFilterData;

    if(this.currentPlayer) {
      this.isLeader = this.currentPlayer.is_team_lead;
      if(this.currentPlayer.team_id) {
        this.teamSegment = "matches";
      }
      
    }
  }

  async ionViewDidLoad() 
  {
    this.apiService.handleLoading();
    if(this.currentPlayer.team_id) {
      await this.getMatches();

      this.getTeamPlayers();
      this.getTeam();
      this.getJoiningTeamRequests();
    } else {
      this.getInviteRequests();
    }
  }

  async doRefresh(refresher)
  {
    await this.ionViewDidLoad();
    refresher.complete();
  }

  getInvite()
  {
  }

  // match tab
  confirmJoinMatch(status)
  {
    this.apiService.handleLoading();
    let confirm  = {confirmStatus: status, matchId: this.selectedMatchId};
    this.apiService.confirmJoinMatch(confirm).
    then((data: any) => {
      this.apiService.handlePostResult(data.code);
      if(data.code == this.apiService.resultCodeSuccess) {
        this.getMatch(this.selectedMatchId);
      }
    }, error => console.log(error));
  }
  async getMatches()
  {
    await this.apiService.getMatches()
    .then((data: any) => {
      this.matches         = data;
      if(data.length) {
        this.selectedMatchId = this.matches[0].id;
        if(this.selectedMatchId) this.getMatch(this.selectedMatchId);
      }
    }, error =>  console.log(error));
  }

  async getMatch(id)
  {
    // this.apiService.handleLoading();
    await this.apiService.getMatch(id).
    then((data: any) => {
      this.selectedMatch        = data.match;
      this.selectedMatchPlayers = data.players;
      this.confirmStatusData    = data.confirmStatusData;
      if(data.confirmStatusData) {
        this.confirmStatus        = data.confirmStatusData.confirm_status;
      } else {
        this.confirmStatusData = {};
      }
    }, error => console.log(error));
  }

  createMatch()
  {
    alert('creating ... match');

  }

  //infotab
  async getJoiningTeamRequests()
  {
    await this.apiService.getJoiningTeamRequests().
    then((data: any) => {
      this.joiningRequests = data;
      if(data.length) {
        this.teamSegment       = "information";
      }
    }, error => console.log(error));
  }

  async getInviteRequests()
  {
    await this.apiService.getInviteRequests().
    then((data: any) => {
      console.log(data);
      this.inviteRequests = data;
    }, error => console.log(error));
  }


  async getTeam()
  {
    await this.apiService.getTeam()
    .then((data: any) => {
      this.team = data;
    }, error => console.log(error));
  }

  getLocations() 
  {
    this.apiService.getLocations()
    .then(data => {
      this.cities = data['results']['cities'];
      this.districtsByCity  = data['results']['districts_by_city'];
    });
  }

  getLevels() 
  {
    this.apiService.getProperties('level')
    .then(data => {
      this.levels = data;
    });
  }

  async getPlayer()
  {
    await this.apiService.getPlayer()
    .then((data: any) => {
      this.isLeader = data.is_team_lead;
      if(data.team_id) {
        this.teamSegment = "matches";
      }
      this.teamParams = {player: this.currentPlayer};
      this.defaultFilterData = {cityId: data.city_id, districtId: data.district_id, levelId: data.level_id, positionId: data.position_id};
      this.isDataLoaded = true;
    }, error =>console.log(error)
    );
  }

  async getTeamPlayers()
  {
    this.apiService.getTeamPlayers().
    then((data:any) => {
      this.teamPlayers = data;
    });
  }

  acceptInvite(id, isAccept)
  {
    let join = {id: id, isAccept: isAccept};
    this.apiService.updateInviteMember(join).
    then((data: any) => {
      this.apiService.handlePostResult(data.code);

      this.events.publish('player:acceptInvite');
      
      this.ionViewDidLoad();
    }, error => console.log(error));
  }

  declineInvite(id, isAccept)
  {
    let join = {id: id, isAccept: isAccept};
    this.apiService.updateInviteMember(join).
    then((data: any) => {
      this.apiService.handlePostResult(data.code);
      this.ionViewDidLoad();
    }, error => console.log(error));
  }

  async accept(id, isAccept) 
  {
    let join = {id: id, isAccept: isAccept};
    await this.apiService.updateJoinTeam(join).
    then((data: any) => {
      this.apiService.handlePostResult(data.code);
      this.getJoiningTeamRequests();
    }, error => console.log(error));
  }

  async decline(id, isAccept)
  {
    let join = {id: id, isAccept: isAccept};
    await this.apiService.updateJoinTeam(join).
    then((data: any) => {
      this.apiService.handlePostResult(data.code);
      this.getJoiningTeamRequests();
    }, error => console.log(error));
  }

  openModalAddMatch()
  {
    let data = {cities: this.cities, districtsByCity: this.districtsByCity, levels: this.levels, filterData: this.defaultFilterData};
    let modal = this.modalCtrl.create(ModalAddMatch, data);

    modal.onDidDismiss(data => {
      if(data) {
        this.getMatches();
      }
    });
    modal.present();
  }

  add(){
    alert('add function');
  }

  // team member function 
  showInviteMemberPrompt() {
    let prompt = this.alertCtrl.create({
      title: 'Thêm thành viên',
      message: "Email/phone bạn muốn thêm vào đội:",
      inputs: [
        {
          name: 'email',
        },
      ],
      buttons: [
        {
          text: 'Thôi',
          handler: data => {
          }
        },
        {
          text: 'Gửi',
          handler: data => {
            this.addInviteMember(data.email);
          }
        }
      ]
    });
    prompt.present();
  }
  showJoinTeamPrompt() {
    let prompt = this.alertCtrl.create({
      title: 'Xin vào đội',
      message: "Nhập email/phone của thành viên trong đội bạn muốn vào.",
      inputs: [
        {
          name: 'email',
        },
      ],
      buttons: [
        {
          text: 'Thôi',
          handler: data => {
          }
        },
        {
          text: 'Gửi',
          handler: data => {
            this.addJoinTeam(data.email);
          }
        }
      ]
    });
    prompt.present();
  }


  // No Team 
  openAddTeamModal()
  {
    let data = {cities: this.cities, districtsByCity: this.districtsByCity, levels: this.levels, filterData: this.filterData};
    console.log('opening add team', data);
    let modal = this.modalCtrl.create(ModalAddTeam, data);

    modal.onDidDismiss(data => {
      if(data) {
        this.ionViewDidLoad();
      }
    });
    modal.present();
  }

  async openUpdateTeamModal(team)
  {
    let data = {cities: this.cities, districtsByCity: this.districtsByCity, levels: this.levels, beingEditedTeam: team};
    let modal = this.modalCtrl.create(ModalUpdateTeam, data);
    modal.onDidDismiss((data: any) => {
      if(data) {
        this.ionViewDidLoad();
      }
    });

    modal.present();
  }

  addJoinTeam(email)
  {
    this.apiService.handleLoading();
    let join = {email: email};
    this.apiService.addJoinTeam(join)
    .then((data: any) => {
      this.apiService.handlePostResult(data.code, data.message);
    }, error => console.log(error));
  }
  addInviteMember(email)
  {
    this.apiService.handleLoading();
    let join = {email: email};
    this.apiService.addInviteMember(join)
    .then((data: any) => {
      this.apiService.handlePostResult(data.code, data.message);
    }, error => console.log(error));
  }

  openPlayerDetailModal(teamPlayer) 
  {
    let data = {player: teamPlayer};
    
    let modal = this.modalCtrl.create(ModalPlayerDetail, data);
    modal.present();
  }

  showConfirmRemoveMember(playerId) {
    let confirm = this.alertCtrl.create({
      title: 'Xóa thành viên',
      message: 'Thành viên này sẽ bị xóa khỏi đội của bạn.',
      buttons: [
        {
          text: 'Thôi',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'OK',
          handler: () => {
            let data = {id: playerId};
            this.apiService.removeMember(data).
            then((data: any) => {
              this.apiService.handlePostResult(data.code);
              this.apiService.handleLoading();
              this.getTeamPlayers();
            }, error => console.log(error));
          }
        }
      ]
    });
    confirm.present();
  }

  removeMember(playerId)
  {
    
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
  constructor() 
  {}
}

@Component({
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>
          Tạo đội
        </ion-title>
        <ion-buttons start>
          <button ion-button (click)="dismiss()">
            <span ion-text color="light" showWhen="ios">Cancel</span>
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
                <ion-label stacked>Thành Phố *</ion-label>
                <ion-select formControlName="cityId" [(ngModel)]="selectedCity" (ngModelChange)="updateDistrict()" cancelText="Cancel" okText="Select">
                  <ion-option *ngFor="let city of cities" value="{{city.id}}">{{city.name}}</ion-option>
                </ion-select>
              </ion-item>
              <ion-item>
                <ion-label stacked>Quận/Huyện *</ion-label>
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
                <ion-label stacked>Tên Đội *</ion-label>
                <ion-input type="text" formControlName="name"></ion-input>
              </ion-item>
              <ion-item text-wrap> 
                <ion-label stacked>Giới Thiệu Đội</ion-label>
                <textarea type="text" formControlName="message"></textarea>
              </ion-item>
              <ion-item>
                <ion-label stacked>Tuổi Trung Bình</ion-label>
                <ion-input type="number" formControlName="averageAge"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label stacked>Số Thành Viên</ion-label>
                <ion-input type="number" formControlName="numberOfMember"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label stacked>Thời gian chiến</ion-label>
                <ion-input type="text" formControlName="usualMatchTime"></ion-input>
              </ion-item>
              <ion-fab right bottom>
                <ion-buttons end>
                  <button ion-fab color="primary" type="submit" [disabled]="!teamForm.valid">
                    <ion-icon name="send"></ion-icon>
                  </button>
                </ion-buttons>
              </ion-fab>
            </form>
          </ion-list>
        </ion-card-content>
      </ion-card>
    </ion-content>
  `,
})
export class ModalAddTeam {
  private teamForm : FormGroup;
  // data
  cities           : any;
  levels           : any;
  districts        : any;
  currentDate      : string;
  districtsByCity  : any;
  
  filterData       : any;
  selectedCity     : any;

  constructor(
    public params      : NavParams,
    public apiService  : ApiService,
    public viewCtrl    : ViewController,
    public formBuilder : FormBuilder,
  ) {
    this.currentDate     = new Date().toISOString();

    this.levels          = this.params.get('levels');
    this.cities          = this.params.get('cities');
    this.districtsByCity = this.params.get('districtsByCity');
    
    this.filterData      = this.params.get('filterData');

    if(this.filterData.cityId) {
      this.selectedCity  = this.filterData.cityId;
      this.updateDistrict();
      // this.districts       = this.districtsByCity[this.filterData.cityId].districts;
    }

    this.teamForm        = this.formBuilder.group({
      message         : [''],
      averageAge      : [''],
      numberOfMember  : [''],
      usualMatchTime  : [''],
      isFindingMember : [''],
      cityId          : [this.filterData.cityId],
      name            : ['', Validators.required],
      levelId         : [this.filterData.levelIds],
      districtId      : [this.filterData.districtIds, Validators.required],
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

@Component({
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>
          Tạo đội
        </ion-title>
        <ion-buttons start>
          <button ion-button (click)="dismiss()">
            <span ion-text color="light" showWhen="ios">Cancel</span>
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
                <ion-label stacked>Thành Phố *</ion-label>
                <ion-select formControlName="cityId" [(ngModel)]="selectedCity" (ngModelChange)="updateDistrict()" cancelText="Cancel" okText="Select">
                  <ion-option *ngFor="let city of cities" value="{{city.id}}">{{city.name}}</ion-option>
                </ion-select>
              </ion-item>
              <ion-item>
                <ion-label stacked>Quận/Huyện *</ion-label>
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
                <ion-label stacked>Tên Đội *</ion-label>
                <ion-input type="text" formControlName="name"></ion-input>
              </ion-item>
              <ion-item text-wrap> 
                <ion-label stacked>Giới Thiệu Đội</ion-label>
                <textarea type="text" formControlName="message"></textarea>
              </ion-item>
              <ion-item>
                <ion-label stacked>Tuổi Trung Bình</ion-label>
                <ion-input type="number" formControlName="averageAge"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label stacked>Số Thành Viên</ion-label>
                <ion-input type="number" formControlName="numberOfMember"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label stacked>Thời gian chiến</ion-label>
                <ion-input type="text" formControlName="usualMatchTime"></ion-input>
              </ion-item>
              <ion-fab right bottom>
                <ion-buttons end>
                  <button ion-fab color="primary" type="submit" [disabled]="!teamForm.valid">
                    <ion-icon name="send"></ion-icon>
                  </button>
                </ion-buttons>
              </ion-fab>
            </form>
          </ion-list>
        </ion-card-content>
      </ion-card>
    </ion-content>
  `,
})
export class ModalUpdateTeam {
  private teamForm : FormGroup;
  // data
  cities           : any;
  levels           : any;
  districts        : any;
  currentDate      : string;
  districtsByCity  : any;

  beingEditedTeam  : any;
  
  filterData       : any;
  selectedCity     : any;

  constructor(
    public params      : NavParams,
    public apiService  : ApiService,
    public viewCtrl    : ViewController,
    public formBuilder : FormBuilder,
  ) {
    this.currentDate     = new Date().toISOString();

    this.levels          = this.params.get('levels');
    this.cities          = this.params.get('cities');
    this.districtsByCity = this.params.get('districtsByCity');
    this.beingEditedTeam = this.params.get('beingEditedTeam');
      
    if(this.beingEditedTeam.city_id) {
      this.selectedCity  = this.beingEditedTeam.city_id;
      this.updateDistrict();
    }

    this.teamForm        = this.formBuilder.group({
      id              : [this.beingEditedTeam.id],
      message         : [this.beingEditedTeam.message],
      averageAge      : [this.beingEditedTeam.average_age],
      numberOfMember  : [this.beingEditedTeam.number_of_member],
      usualMatchTime  : [this.beingEditedTeam.usual_match_time],
      isFindingMember : [this.beingEditedTeam.is_finding_member],
      cityId          : [this.beingEditedTeam.city_id],
      name            : [this.beingEditedTeam.name, Validators.required],
      levelId         : [this.beingEditedTeam.level_id],
      districtId      : [this.beingEditedTeam.district_id, Validators.required],
    });
  }

  updateDistrict() {
    if(this.selectedCity) {
      this.districts = this.districtsByCity[this.selectedCity].districts;
    }
  }

  async logForm() {
    this.apiService.handleLoading();
    await this.apiService.updateTeam(this.teamForm.value)
      .then((data: any) => {
        this.apiService.handlePostResult(data.code);
        this.viewCtrl.dismiss(data);
      }, error => console.log(error));
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
}


@Component({
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>
          Lên kèo
        </ion-title>
        <ion-buttons start>
          <button ion-button (click)="dismiss()">
            <span ion-text color="light" showWhen="ios">Cancel</span>
            <ion-icon name="md-close" showWhen="android,windows"></ion-icon>
          </button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      
          <ion-list>
            <form [formGroup]="teamForm" (ngSubmit)="logForm()">
              
              <ion-item>
                <ion-label stacked>Địa chỉ Sân</ion-label>
                <ion-input type="text" formControlName="address"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label stacked>Date</ion-label>
                <ion-datetime displayFormat="DDDD MMMM/D" pickerFormat="MMMM D"   [min]="currentDate" formControlName="matchDate"></ion-datetime>
              </ion-item>

              <ion-item>
                <ion-label stacked>Từ</ion-label>
                <ion-datetime displayFormat="HH:mm" pickerFormat="HH:mm" formControlName="from" minuteValues="0,15,30,45"></ion-datetime>
              </ion-item>
              <ion-item>
                <ion-label stacked>Tới</ion-label>
                <ion-datetime displayFormat="HH:mm" pickerFormat="HH:mm"  formControlName="to" minuteValues="0,15,30,45"></ion-datetime>
              </ion-item>
              <ion-item text-wrap>
                <ion-label stacked>Lời  nhắn</ion-label>
                <ion-textarea type="text" formControlName="message"></ion-textarea>
              </ion-item>
              <ion-fab right bottom>
                <ion-buttons end>
                  <button ion-fab color="primary" type="submit" [disabled]="!teamForm.valid">
                    <ion-icon name="send"></ion-icon>
                  </button>
                </ion-buttons>
              </ion-fab>
            </form>
          </ion-list>
       
    </ion-content>
  `,
})
export class ModalAddMatch {
  private teamForm : FormGroup;
  // data
  currentDate      : any;
  
  constructor(
    public params      : NavParams,
    public apiService  : ApiService,
    public formBuilder : FormBuilder,
    public viewCtrl    : ViewController,
  ) {
    this.currentDate     = new Date().toISOString();
    this.teamForm = this.formBuilder.group({
      address   : ['',Validators.required],
      message   : [''],
      from      : ['18:00', Validators.required],
      to        : ['20:00'],
      matchDate : [this.currentDate],
    });
  }

  async logForm() {
    this.apiService.handleLoading();
    await this.apiService.createMatch(this.teamForm.value)
      .then((data: any) => {
        this.apiService.handlePostResult(data.code);
        this.viewCtrl.dismiss(data);
        // need to reload page with new Team params.
      }, error => console.log(error));
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
}

@Component({
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>
          Chi tiết
        </ion-title>
        <ion-buttons start>
          <button ion-button (click)="dismiss()">
            <span ion-text color="light" showWhen="ios">Cancel</span>
            <ion-icon name="md-close" showWhen="android,windows"></ion-icon>
          </button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <ion-item>
            <ion-label>Tên đội : </ion-label>
            <p item-end>{{team.name}}</p>
        </ion-item>
        <ion-item>
            <ion-label>Quận</ion-label>
            <p item-end>2</p>
        </ion-item>
        <ion-item>
            <ion-label>Tuổi trung binh</ion-label>
            <p item-end>{{team.average_age}}</p>
        </ion-item>
        <ion-item>
            <ion-label>Số Thành Viên</ion-label>
            <p item-end>{{team.number_of_member}}</p>
        </ion-item>
        <ion-item text-wrap >
            <ion-label>Thoi gian hoat dong</ion-label>
            <p>{{team.usual_match_time}} </p>
        </ion-item>
        <ion-item text-wrap *ngIf="team.message">
          <ion-label>Giới thiệu</ion-label>
          <p>{{team.message}}</p>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
})
export class ModalTeamDetail {
  team;
  constructor(
    public params     : NavParams,
    public viewCtrl   : ViewController,
  ) {
    this.team = this.params.get('team');
  }

  dismiss() 
  {
    this.viewCtrl.dismiss();
  }
}

@Component({
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>
          Chi tiết
        </ion-title>
        <ion-buttons start>
          <button ion-button (click)="dismiss()">
            <span ion-text color="light" showWhen="ios">Cancel</span>
            <ion-icon name="md-close" showWhen="android,windows"></ion-icon>
          </button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <ion-item>
            <ion-label>Tên : </ion-label>
            <p item-end>{{player.name}}</p>
        </ion-item>
        <ion-item>
            <ion-label>Quận</ion-label>
            <p item-end>2</p>
        </ion-item>
        <ion-item>
            <ion-label>Tuổi trung binh</ion-label>
            <p item-end>{{player.name}}</p>
        </ion-item>
        <ion-item>
            <ion-label>Số Thành Viên</ion-label>
            <p item-end>{{player.name}}</p>
        </ion-item>
        <ion-item text-wrap >
            <ion-label>Thoi gian hoat dong</ion-label>
            <p>{{player.name}} </p>
        </ion-item>
        <ion-item text-wrap *ngIf="player.name">
          <ion-label>Giới thiệu</ion-label>
          <p>{{player.name}}</p>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
})
export class ModalPlayerDetail {
  player;
  constructor(
    public params     : NavParams,
    public viewCtrl   : ViewController,
  ) {
    this.player = this.params.get('player');
  }

  dismiss() 
  {
    this.viewCtrl.dismiss();
  }
}
