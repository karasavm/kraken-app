import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {Subject} from "rxjs/Subject";

@Injectable()
export class NavigationService {

  routeName: string = '';
  params: any = {};
  data: any = {};
  routeChanged = new Subject<{routeName: string, params: any, data: any}>();

  constructor(private router: Router) { }

  signInUri = '/signin';


  //////////////////////////////////////////////
  setRouteStatus(routeName, params, data) {
    console.log("Route Status Set: ", routeName, params, data);
    this.routeName = routeName;
    this.params = params;
    this.data = data;

    this.routeChanged.next({routeName: this.routeName, params: this.params, data: this.data});
  }

  getRouteStatus() {
    return {routeName: this.routeName, params: this.params};
  }
  //////////////////////////////////////////////
  groupListUri() {
    return '/groups';
  }

  groupSettingsUri(groupId: string) {
    return '/groups/' + groupId + '/settings';
  }

  groupTransactionsUri(groupId: string) {
    return '/groups/' + groupId + '/transactions';
  }

  groupDashboardUri(groupId: string) {
    return '/groups/' + groupId + '/dashboard';
  }


  signIn() {
    console.log("sign in")
    this.router.navigate(['/signin']);
  }


  signUp() {
      this.router.navigate(['/signup']);
  }

  groupSettings(groupId: string) {
    this.router.navigate(['/groups/' + groupId + '/settings']);
  }

  groupList() {
    this.router.navigate(['/groups']);
  }


  groupTransactions(groupId: string) {
    this.router.navigate(['/groups/' + groupId + '/transactions']);
  }

  groupDashboard(groupid){
    this.router.navigate([this.groupDashboardUri(groupid)]);
  }

  transaction(groupId: string, transId: string) {
    this.router.navigate(['/groups/' + groupId + '/transactions/' + transId]);
  }
  transactionUri(groupId: string, transId: string) {
    return '/groups/' + groupId + '/transactions/' + transId;
  }

  transactionTemp(groupId: string, transId: string) {
    this.router.navigate(['/groups/' + groupId + '/transactions_temp/' + transId]);
  }

  toUrl(url: string) {
    this.router.navigate([url]);
  }
}
