import {
  AfterContentInit, AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, Component, NgModule, OnChanges, OnDestroy,
  OnInit
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HeaderService} from './header.service';
import {Subscription} from 'rxjs/Subscription';
import {AuthService} from '../auth/auth.service';
import {Location} from '@angular/common';
import {NavigationService} from '../shared/services/navigation.service';
// import {ChangeDetectionStrategy} from '@angular/compiler/src/core';


const defaultTitle = 'Kraken';
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

  constructor(
    public router: Router,
    private headerService: HeaderService,
    private route: ActivatedRoute,
    public authService: AuthService,
    private location: Location,
    private navService: NavigationService
  ) {}


  settingsTab() {
    if (this.stateName === 'settings') {
      return 'active';
    }
    return '';
  }

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

    // this.subscription = this.headerService.titleChanged
    //   .subscribe((title) => {
    //     console.log("Observer handler title", title)
    //     this.curTitle = title;
    //   });


    // this.subscription2 = this.headerService.revealGroupTabs
    //   .subscribe((v) => {
    //     this.showTabs = v;
    //
    //     console.log("Observer Handler showtabs", this.showTabs);
    //   });

    // this.subscription3 = this.headerService.groupId
    //   .subscribe((v) => {
    //     this.groupId = v;
    //
    //     console.log("Observer Handler groupId", this.groupId);
    //   });

    this.subscription4 = this.headerService.stateChanged
      .subscribe((state) => {

        if (state.stateName === 'auth') {
          this.showAuthTabs = true;
          this.showGroupTabs = false;
          this.curTitle = defaultTitle;
        } else if (state.stateName === 'groupList') {
          this.showAuthTabs = false;
          this.showGroupTabs = false;
          this.curTitle = defaultTitle;
        } else if (state.stateName === 'dashboard' ||
          state.stateName === 'transactions' ||
          state.stateName === 'settings') {

          this.stateName = state.stateName;
          this.showGroupTabs = true;
          this.showAuthTabs = false;
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
    if (this.curTitle.length > 12) {
      return this.curTitle.slice(0, 12) + '...';
    }
    return this.curTitle;
  }


  backPath() {
    const url = this.router.url.split('/');

    if (url.length === 5) {
      return url.splice(0, url.length - 1);
    } else {
      return '/groups';
    }
  }

  onClickLogout() {
    this.authService.logout();
  }

  userName() {
    return localStorage.getItem('name');
  }

  userEmail() {
    return localStorage.getItem('email');
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
    this.subscription3.unsubscribe();
    this.subscription4.unsubscribe();
  }
}
