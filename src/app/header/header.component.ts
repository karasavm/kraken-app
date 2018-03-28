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
const editUsersTitle = 'Edit Users'

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
  wasDashboard = false;

  @Output() onClickCollaboration = new EventEmitter();

  constructor(
    public router: Router,
    private headerService: HeaderService,
    private route: ActivatedRoute,
    public authService: AuthService,
    private location: Location,
    private navService: NavigationService,
    private groupService: GroupService,
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
      });
    this.subscription1 = this.headerService.titleChanged.subscribe(title => this.curTitle = title);

    this.subscription = this.navService.routeChanged.subscribe((routeStatus) => {


      // const data = routeStatus.data;
      const params = routeStatus.params;
      const routeName = routeStatus.routeName;

      this.routeName = routeName;

      // keep logged dashboar or transactions
      if (this.routeName === 'dashboard') {
        this.wasDashboard = true;
      } else if (this.routeName === 'users') {

      } else {
        this.wasDashboard = false;
      }

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
      } else if (routeName === 'users') {
        this.curTitle = editUsersTitle;
        this.showAuthTabs = false;
        this.showGroupTabs = false;
      } else if (routeName === 'dashboard' || routeName === 'transactions') {
        // title is been set on ngOnInit inside component with header setTitle service
        this.showAuthTabs = false;
        this.showGroupTabs = true;
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
    if (this.curTitle.length > 12) {
      return this.curTitle.slice(0, 8) + '...';
    }
    return this.curTitle;
  }


  backPath() {

    const url = this.router.url.split('/');

    if (this.routeName === 'settings') {
      // eturn rthis.navService.groupDashboardUri(this.groupId);
    } else if (this.routeName === 'users') {
      // navigate back to 'transactions' or 'dashboard' depending from where you navigated to users
      // this.location.back();
      if (this.wasDashboard) {
        this.navService.groupDashboard(this.groupId);
      } else {
        this.navService.groupTransactions(this.groupId);
      }

    } else if (this.routeName === 'dashboard' || this.routeName === 'transactions') {
      this.navService.groupList();
    } else if (this.routeName === 'transaction-edit') {
      this.navService.groupTransactions(this.groupId);
    } else {
      console.log("NAVIGATE BACK TO NOWHERE!!!!")
      // this.navService.groupList();
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

  onClickUsersButton() {
    this.navService.groupUsers(this.groupId);
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
