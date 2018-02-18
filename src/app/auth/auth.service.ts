import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {host} from '../config';
import {User} from '../models/user.model';
import {NavigationService} from '../shared/services/navigation.service';

// const uri = 'http://localhost:3000/api';

@Injectable()
export class AuthService {

  // token: string = null;
  redirectUrl: string;

  constructor(private http: HttpClient,
              private router: Router,
              private navService: NavigationService) {

    // default redirect page
    this.redirectUrl = this.navService.groupListUri();
  }



  removeToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('name');
  }

  registerUser(email: string, password: string, name: string) {

    // this.groups[index].members.push(new Member(memberName));
    const body = {user: {email: email, password: password, name: name}};
    return this.http.post(host + '/users/register', body, {observe: 'response'})
      .subscribe((res) => {
        this.storeToken(res.body['user']);
        this.navService.groupList();
        return res.body;
      }, (err) => {
        //todo: handle wrong data for sign up
      });
  }

  storeToken(user) {
    localStorage.setItem('token', user['token']);
    localStorage.setItem('email', user['email']);
    localStorage.setItem('name', user['name']);
  }

  retriveToken() {
    return localStorage.getItem('token');
  }

  loginUser(email: string, password: string) {
    //todo: send a message
    //todo: form validation for email
    console.log('HTTP call POST /login');
    // this.groups[index].members.push(new Member(memberName));
    const body = {user: {email: email, password: password}};
    return this.http.post<{ user: User }>(host + '/users/login', body, {observe: 'response'})
      .subscribe((res) => {
        console.log('Response', res);
        this.storeToken(res.body.user);
        this.navService.toUrl(this.redirectUrl);
      }, (err) => {
        console.log('Error', err);
      })
      ;
  }

  isAuthenticated() {
    // console.log(this.token !== null)
    // return this.token !== null;

    //todo: check why is called so much this function
    // console.log("isAuthenticated");
    if (this.retriveToken()) {
      // logged in so return true
      return true;
    }
    return false;


  }

  logout() {
    console.log("logging out....");
    // this.token = null;
    this.removeToken();

    if (this.router.url !== this.navService.signInUri) {
      // this.redirectUrl = this.router.url; // no redirect url cache functionality
      this.redirectUrl = this.navService.groupListUri();
    }

    this.navService.signIn();
  }
}
