import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../auth.service';
import {NavigationService} from '../../shared/services/navigation.service';
import {HeaderService} from '../../header/header.service';
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'app-sigin',
  templateUrl: './sigin.component.html',
  styleUrls: ['./sigin.component.css']
})
export class SiginComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  status: string = '';

  constructor(private authService: AuthService,
              public navService: NavigationService,
              private headerService: HeaderService) { }

  ngOnInit() {

    this.subscription = this.authService.loginStatusChanged
      .subscribe((status) => {
        this.status = status;
      });

    // this.headerService.hideGroupTabs();
  }


  onSigin(form: NgForm) {
    this.status = '';
    console.log("SignIn Form",form);
    const email = form.value.email;
    const password = form.value.password;
    this.authService.loginUser(email, password);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
