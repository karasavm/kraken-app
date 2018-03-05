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
  routeName: string = '';
  showGroupTabs = false;
  showAuthTabs = false;
  groupId = null;
  transId = null;
  currentUser = getCurrentUser;

  @Output() onClickCollaboration = new EventEmitter();

  constructor(
    public router: Router,
    private headerService: HeaderService,
    private route: ActivatedRoute,
    public authService: AuthService,
    private location: Location,
    private navService: NavigationService
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


    this.subscription = this.navService.routeChanged.subscribe((routeStatus) => {

      const data = routeStatus.data;
      const params = routeStatus.params;
      const routeName = routeStatus.routeName;

      this.routeName = routeName;


      // set title
      if (data.title) {
        this.curTitle = data.title;
      } else {
        this.curTitle = defaultTitle;
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
      } else if (routeName === 'groups') {
        this.showAuthTabs = false;
        this.showGroupTabs = false;
      } else if (routeName === 'dashboard' || routeName === 'transactions') {
        this.showAuthTabs = false;
        this.showGroupTabs = true;

      } else if (routeName === 'settings') {
        this.showAuthTabs = false;
        this.showGroupTabs = false;
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
    if (this.curTitle.length > 16) {
      return this.curTitle.slice(0, 16) + '...';
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
    console.log("Collaboration button pressed")
    this.headerService.onClickCollaboration.emit();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onClickTransactionSave() {
    console.log("Transaction save pressed");
    this.headerService.onClickTransactionSave.emit();
  }
}
