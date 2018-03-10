import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {GroupService} from '../../groups/group.service';
import {AuthService} from '../auth.service';
import {HeaderService} from '../../header/header.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private headerService: HeaderService
  ) { }

  ngOnInit() {
  }

  onSignup(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;
    const name = form.value.name;
    this.authService.registerUser(email, password, name);
  }

}
