import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {GroupListComponent} from './groups/group-list/group-list.component';
import {GroupEditComponent} from './groups/group-edit/group-edit.component';
import {GroupDetailComponent} from './groups/group-detail/group-detail.component';
import {GroupsResolver} from './groups/group-list/groups.resolver';
import {SignupComponent} from './auth/signup/signup.component';
import { SiginComponent } from './auth/sigin/sigin.component';
import {AuthGuardService} from './auth/auth-guard.service';
import {GroupComponent} from './groups/group/group.component';
import {GroupDashboardComponent} from './groups/group-dashboard/group-dashboard.component';
import {TransactionEditNewComponent} from './groups/transaction-edit-new/transaction-edit-new.component';
import {GroupResolver} from './groups/group-detail/group.resolver';
import {TransactionResolver} from './groups/transaction-edit-new/transaction.resolver';
import {AuthComponent} from './auth/auth.component';
import {TransactionEditComponent} from "./groups/transaction-edit/transaction-edit.component";
const routes: Routes = [
  { path: '', redirectTo: '/groups', pathMatch: 'full', canActivate: [AuthGuardService] },
  { data: {routeName: "groups"}, path: 'groups', component: GroupListComponent, resolve: {groups: GroupsResolver}, canActivate: [AuthGuardService]},


  { path: 'groups/:id', component: GroupComponent, canActivate: [AuthGuardService], resolve: {group: GroupResolver}, children: [
      { data: {routeName: "transactions"}, path: 'transactions',  component: GroupDetailComponent, canActivate: [AuthGuardService]},
      { data: {routeName: "settings"}, path: 'settings', component: GroupEditComponent, canActivate: [AuthGuardService]},
      { data: {routeName: "dashboard"}, path: 'dashboard', component: GroupDashboardComponent, canActivate: [AuthGuardService]},
      { path: '', redirectTo: 'dashboard', pathMatch: 'full', canActivate: [AuthGuardService]}
    ]},

  { data: {routeName: "transaction-edit"}, path: 'groups/:id/transactions/:transId', resolve: {transData: TransactionResolver}, component: TransactionEditComponent, canActivate: [AuthGuardService]},

  { data: {routeName: "signup"}, path: 'signup', component: SignupComponent },
  { data: {routeName: "signin"}, path: 'signin', component: SiginComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
