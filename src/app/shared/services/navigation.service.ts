import { Injectable } from '@angular/core';
import {Router} from '@angular/router';

@Injectable()
export class NavigationService {

  constructor(private router: Router) { }

  signInUri = '/signin';


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

  toUrl(url: string) {
    this.router.navigate([url]);
  }
}
