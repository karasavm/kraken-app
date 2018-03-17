import {
  AfterContentInit, AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, NgModule,
  OnChanges, OnDestroy,
  OnInit, Output
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HeaderService} from './header.service';
import {Subscription} from 'rxjs/Subscription';
import {AuthService} from '../auth/auth.service';
import {Location} from '@angular/common';
import {NavigationService} from '../shared/services/navigation.service';
import {getCurrentUser} from "../shared/helper";
import {User} from "../models/user.model";
import {environment} from "../../environments/environment";
import {GroupService} from "../groups/group.service";
// import {ChangeDetectionStrategy} from '@angular/compiler/src/core';


const defaultTitle = 'Kraken';
const editGroupTitle = 'Group Details';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
@NgModule()
export class HeaderComponent implements OnInit, OnDestroy {

  curTitle: string = '';
  subscription: Subscription;
  subscription1: Subscription;
  subscription3: Subscription;
  routeName: string = '';
  showGroupTabs = false;
  showAuthTabs = false;
  groupId = null;
  transId = null;
  saveBtnDisabled = true;
  currentUser = getCurrentUser;

  @Output() onClickCollaboration = new EventEmitter();

  constructor(
    public router: Router,
    private headerService: HeaderService,
    private route: ActivatedRoute,
    public authService: AuthService,
    private location: Location,
    private navService: NavigationService,
    private groupService: GroupService
  ) {}



  dashboardTab() {
    if (this.routeName === 'dashboard') {
      return 'active';
    }
    return '';
  }

  transactionsTab() {

    if (this.routeName === 'transactions') {
      return 'active';
    }
    return '';
  }


  ngOnInit() {

    this.subscription3 = this.headerService.saveTransactionBtnDisabledChanged
      .subscribe((disabled) => {
        this.saveBtnDisabled = disabled;
      })
    this.subscription1 = this.headerService.titleChanged.subscribe(title => this.curTitle = title);

    this.subscription = this.navService.routeChanged.subscribe((routeStatus) => {


      const data = routeStatus.data;
      // console.log("dddddddddddaaaaaaaaaaattttt", data)
      const params = routeStatus.params;
      const routeName = routeStatus.routeName;

      this.routeName = routeName;


      // set title
      // if (data.title) {
      //   this.curTitle = data.title;
      // } else {
      //   this.curTitle = defaultTitle;
      // }

      // set group id
      if (params.id) {
        this.groupId = params.id;
      } else {
        this.groupId = null;
      }

      // set transaction id
      if (params.transId) {
        this.transId = params.transId;
      } else {
        this.transId = null;
      }


      if (routeName === 'signin' || routeName === 'signup') {
        this.showAuthTabs = true;
        this.showGroupTabs = false;
        this.curTitle = defaultTitle;
      } else if (routeName === 'groups') {
        this.curTitle = defaultTitle;
        this.showAuthTabs = false;
        this.showGroupTabs = false;
      } else if (routeName === 'dashboard' || routeName === 'transactions') {
        this.showAuthTabs = false;
        this.showGroupTabs = true;
      // } else if (routeName === 'settings') {
      //   this.showAuthTabs = false;
      //   this.showGroupTabs = false;
      } else if (routeName === 'transaction-edit') {
        this.showAuthTabs = false;
        this.showGroupTabs = false;
      } else {
        // default
        this.showAuthTabs = false;
        this.showGroupTabs = false;
      }
    });

  }



  getCurrTitle() {
    if (this.curTitle.length > 10) {
      return this.curTitle.slice(0, 8) + '...';
    }
    return this.curTitle;
  }


  backPath() {
    const url = this.router.url.split('/');

    if (url.length === 5) {
      return url.splice(0, url.length - 1);
    } else if (this.routeName === 'settings') {
      return this.navService.groupDashboardUri(this.groupId);
    } else {
      return '/groups';
    }
  }

  onClickLogout() {
    this.authService.logout();
  }

  onClickCollab() {
    this.headerService.onClickCollaboration.emit();
  }

  onClickEditMembers() {

  }

  onClickHeaderButton(button) {
    this.headerService.onClickHeaderButton.emit(button);
  }
  onClickRenewGroups() {
    this.headerService.onClickRenewGroupsButton.emit(null);
  }

  onClickTransactionSave() {
    console.log("Transaction save pressed");
    if (!this.saveBtnDisabled) {


      this.headerService.onClickTransactionSave.emit();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
