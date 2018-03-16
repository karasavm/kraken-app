// import {MzModalModule, MzTabModule} from 'ng2-materialize';
// import 'materialize-css';

import { MaterializeModule } from 'angular2-materialize';


import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import {AppComponent} from './app.component';
import { GroupListComponent } from './groups/group-list/group-list.component';
import { HeaderComponent } from './header/header.component';
import {HeaderService} from './header/header.service';
import { AppRoutingModule } from './app-routing.module';
import { GroupDetailComponent } from './groups/group/group-detail/group-detail.component';
import {GroupService} from './groups/group.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {GroupsResolver} from './groups/group-list/groups.resolver';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { SignupComponent } from './auth/signup/signup.component';
import { SiginComponent } from './auth/sigin/sigin.component';
import {AuthService} from './auth/auth.service';
import {AuthGuardService} from './auth/auth-guard.service';
import {ApiInterceptor} from './shared/api.interceptor';

import { GroupComponent } from './groups/group/group.component';
import { GroupDashboardComponent } from './groups/group/group-dashboard/group-dashboard.component';
import {NavigationService} from './shared/services/navigation.service';
import {GroupResolver} from './groups/group/group-detail/group.resolver';


import {AuthComponent} from './auth/auth.component';
import {ToastMessagesService} from './shared/services/toast-messages.service';

import { ButtonsModule } from 'ngx-bootstrap';
import {TransactionEditComponent} from "./groups/transaction-edit/transaction-edit.component";
import { EditMembersComponent } from './groups/group/edit-members/edit-members.component';

import {MatButtonModule, MatDialogModule } from "@angular/material";
import {TransactionResolver} from "./groups/transaction-edit/transaction.resolver";
import { NewTransactionBtnComponent } from './groups/group/new-transaction-btn/new-transaction-btn.component';


@NgModule({
  declarations: [
    AppComponent,
    GroupListComponent,
    HeaderComponent,
    GroupDetailComponent,
    SignupComponent,
    SiginComponent,
    GroupComponent,
    GroupDashboardComponent,
    AuthComponent,
    TransactionEditComponent,
    EditMembersComponent,
    NewTransactionBtnComponent,

  ],
  imports: [
    // Material IO
    MatDialogModule,
    MatButtonModule,

    ButtonsModule.forRoot(),
    MaterializeModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule
  ],
  // for
  entryComponents: [EditMembersComponent],

  providers: [
    GroupService,
    HeaderService,
    GroupsResolver,
    TransactionResolver,
    GroupResolver,
    AuthGuardService,
    NavigationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true,
    },
    AuthService,
    ToastMessagesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
