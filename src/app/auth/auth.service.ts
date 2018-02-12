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
  redirectUrl = '/groups';
  tokenToRemove: string;

  constructor(private http: HttpClient,
              private router: Router,
              private navService: NavigationService) {

    // this.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhNTUwNGIyY2UwMDNjMTg5OGFhMDFlYSIsIm5hbWUiOiJVc2VyIEFkbWluIiwiZXhwIjoxNTIwNzA1MjAyLCJpYXQiOjE1MTU1MjEyMDJ9.N_NLbocZhtr8TpBo2et-PaNT83Wa15GbPi8pQJWKQwc';
  }

  removeToken() {
    // this.tokenToRemove = null;
    // return;
    localStorage.removeItem('token');
  }

  registerUser(email: string, password: string, name: string) {
    console.log('HTTP call POST /register');
    // this.groups[index].members.push(new Member(memberName));
    const body = {user: {email: email, password: password, name: name}};
    return this.http.post(host + '/users/register', body, {observe: 'response'})
      .subscribe((res) => {
        console.log('Response', res);
        // this.token = res.body['user.token'];
        this.storeToken(res.body['user.token']);
        this.navService.groupList();
        return res.body;
      }, (err) => {
        console.log('Error', err);
      });
  }

  storeToken(token) {
    // this.tokenToRemove = token;
    // return;
    localStorage.setItem('token', token);
  }

  retriveToken() {
    // return this.tokenToRemove;
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
        // this.token = res.body['user.token'];
        this.storeToken(res.body.user.token);
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
    // this.token = null;
    this.removeToken();

    if (this.router.url !== this.navService.signInUri) {
      this.redirectUrl = this.router.url;
    }

    this.navService.signIn();
  }
}
