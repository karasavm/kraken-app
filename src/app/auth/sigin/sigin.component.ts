import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../auth.service';
import {NavigationService} from '../../shared/services/navigation.service';
import {HeaderService} from '../../header/header.service';

@Component({
  selector: 'app-sigin',
  templateUrl: './sigin.component.html',
  styleUrls: ['./sigin.component.css']
})
export class SiginComponent implements OnInit {

  constructor(private authService: AuthService,
              public navService: NavigationService,
              private headerService: HeaderService) { }

  ngOnInit() {

    // this.headerService.hideGroupTabs();
    this.headerService.setState('auth');
  }


  onSigin(form: NgForm) {

    console.log("SignIn Form",form);
    const email = form.value.email;
    const password = form.value.password;
    this.authService.loginUser(email, password);
  }

}
