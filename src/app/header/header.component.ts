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
  subscription2: Subscription;
  subscription3: Subscription;
  subscription4: Subscription;
  stateName: string = '';
  showGroupTabs = false;
  showAuthTabs = false;
  groupId = 'noGroupId';
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
    if (this.stateName === 'dashboard') {
      return 'active';
    }
    return '';
  }

  transactionsTab() {

    if (this.stateName === 'transactions') {
      return 'active';
    }
    return '';
  }


  ngOnInit() {


    this.subscription4 = this.headerService.stateChanged
      .subscribe((state) => {

        this.stateName = state.stateName;

        if (state.stateName === 'auth') {
          this.showAuthTabs = true;
          this.showGroupTabs = false;
          this.curTitle = defaultTitle;
        } else if (state.stateName === 'groupList') {
          this.showAuthTabs = false;
          this.showGroupTabs = false;
          this.curTitle = defaultTitle;
        } else if (state.stateName === 'dashboard' || state.stateName === 'transactions') {
          this.showAuthTabs = false;
          this.showGroupTabs = true;
          this.curTitle = state.title;
          this.groupId = state.groupId;
        } else if (state.stateName === 'settings') {
          this.showAuthTabs = false;
          this.showGroupTabs = false;
          this.curTitle = editGroupTitle;
          this.groupId = state.groupId;
        } else if (state.stateName === 'transaction') {
          this.showAuthTabs = false;
          this.showGroupTabs = false;
          this.curTitle = state.title;
          this.groupId = state.groupId;
        } else {
          // default
          this.showAuthTabs = false;
          this.showGroupTabs = false;
          this.curTitle = defaultTitle;
        }
      })

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
    } else if (this.stateName === 'settings') {
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
    this.subscription2.unsubscribe();
    this.subscription3.unsubscribe();
    this.subscription4.unsubscribe();
  }
}
