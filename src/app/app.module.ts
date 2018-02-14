// import {MzModalModule, MzTabModule} from 'ng2-materialize';
// import 'materialize-css';

import { MaterializeModule } from 'angular2-materialize';


import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { GroupListComponent } from './groups/group-list/group-list.component';
import { HeaderComponent } from './header/header.component';
import {HeaderService} from './header/header.service';
import { GroupEditComponent } from './groups/group-edit/group-edit.component';
import { AppRoutingModule } from './app-routing.module';
import { GroupDetailComponent } from './groups/group-detail/group-detail.component';
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
import { GroupDashboardComponent } from './groups/group-dashboard/group-dashboard.component';
import {NavigationService} from './shared/services/navigation.service';
import { TransactionEditNewComponent } from './groups/transaction-edit-new/transaction-edit-new.component';
import {GroupResolver} from './groups/group-detail/group.resolver';
import {TransactionResolver} from './groups/transaction-edit-new/transaction.resolver';


import {AuthComponent} from './auth/auth.component';
import {ToastMessagesService} from './shared/services/toast-messages.service';

import { ButtonsModule } from 'ngx-bootstrap';
import { TransactionEditGiveComponent } from './groups/transaction-edit-give/transaction-edit-give.component';  //check box buttons on transaction edit

@NgModule({
  declarations: [
    AppComponent,
    GroupListComponent,
    HeaderComponent,
    GroupEditComponent,
    GroupDetailComponent,
    SignupComponent,
    SiginComponent,
    GroupComponent,
    GroupDashboardComponent,
    TransactionEditNewComponent,
    AuthComponent,
    TransactionEditGiveComponent
  ],
  imports: [
    ButtonsModule.forRoot(),
    MaterializeModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    GroupService,
    HeaderService,
    GroupsResolver,
    GroupResolver,
    TransactionResolver,
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
