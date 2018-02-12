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
const routes: Routes = [
  { path: '', redirectTo: '/groups', pathMatch: 'full', canActivate: [AuthGuardService] },
  { path: 'groups', component: GroupListComponent, resolve: {groups: GroupsResolver}, canActivate: [AuthGuardService]},
  { path: 'groups/:id/old', component: GroupDetailComponent, resolve: {group: GroupsResolver}, canActivate: [AuthGuardService]},

  { path: 'groups/:id', redirectTo: '/groups/:id/dashboard', pathMatch: 'full', canActivate: [AuthGuardService]},

  { path: 'groups/:id', component: GroupComponent, canActivate: [AuthGuardService], children: [
      { path: 'transactions',  component: GroupDetailComponent, resolve: {group: GroupResolver}, canActivate: [AuthGuardService]},
      { path: 'settings', component: GroupEditComponent, resolve: {group: GroupResolver}, canActivate: [AuthGuardService]},
      { path: 'dashboard', component: GroupDashboardComponent, resolve: {group: GroupResolver}, canActivate: [AuthGuardService]}
    ]},
  { path: 'edit', component: GroupEditComponent, canActivate: [AuthGuardService]},
  // { path: 'groups/:id/edit', component: GroupEditComponent, resolve: {group: GroupsResolver}, canActivate: [AuthGuardService]},
  // { path: 'groups/:id/new-transaction', component: TransactionEditComponent, canActivate: [AuthGuardService]},
  // { path: 'groups/:id/transactions/:transId', component: TransactionEditComponent, canActivate: [AuthGuardService]},
  { path: 'groups/:id/transactions/:transId', resolve: {transData: TransactionResolver}, component: TransactionEditNewComponent, canActivate: [AuthGuardService]},
  //
  // { path: 'new', component: GroupEditComponent, canActivate: [AuthGuardService] },
  // { path: 'auth', component: AuthComponent, children: [
  //     { path: 'signup', component: SignupComponent },
  //   ]},
  { path: 'signup', component: SignupComponent },
  { path: 'signin', component: SiginComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
