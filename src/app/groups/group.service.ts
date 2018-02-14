import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import {Group} from '../models/group.model';
import {Member} from '../models/member.model';


import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {Router} from '@angular/router';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from '@angular/common/http';
import {tap} from 'rxjs/operators';
import {host} from '../config';
import {Transaction} from '../models/transaction.model';
import {AuthService} from '../auth/auth.service';
import {User} from '../models/user.model';


@Injectable()
export class GroupService {
  groupsChanged = new Subject<any[]>();

  // private groups: Group[] = GROUPS;
  private groups: Group[] = [];

  constructor(private router: Router,
              private http2: HttpClient,
              private authService: AuthService) {
  }


  // new HttpHeaders().set('Authorization', 'my-auth-token'),
  private getHeaders2() {
    return new HttpHeaders().set('Authorization', this.authService.retriveToken());
  }

  getGroups(): Observable<Group[]> {
    return this.http2
      .get(host + '/groups', {headers: this.getHeaders2()})
      .map(data => data['groups'].map(g => Group.JSONtoObject(g)))
      .pipe(
        tap(groups => {} )
      );
  }

  createGroup(name: string): Observable<Group> {

    return this.http2.post(
      host + '/groups',
      {group: {name: name}},
      {observe: 'response', headers: this.getHeaders2()})
      .map(res => Group.JSONtoObject(res.body['group']))
      .pipe(
        tap(groups => {} )
      );
  }


  getGroup(id: string): Observable<Group> {
    return this.http2
      .get(host + '/groups/' + id, {observe: 'response', headers: this.getHeaders2()})
      .map(res => Group.JSONtoObject(res.body['group']))
      .pipe(
        tap(groups => {} )
      );
  }

  deleteGroup(id: string): Observable<any> {
    return this.http2
      .delete(host + '/groups/' + id, {observe: 'response', headers: this.getHeaders2()})
  }



  getTransaction(groupId: string, transId: string): Observable<{transaction: Transaction, members: Member[]}> {
    return this.http2
      .get(
        host + '/groups/' + groupId + '/transactions/' + transId,
        {headers: this.getHeaders2()})
      .map(data => {
        return {
          transaction: Transaction.JSONtoObject(data['transaction']),
          members: data['members'].map(m => Member.JSONtoObject(m))
        };
      });
  }


  deleteTransaction(groupId: string, transId: string): Observable<any> {
    return this.http2
      .delete(
        host + '/groups/' + groupId + '/transactions/' + transId,
        {headers: this.getHeaders2()})
  }



  createTransaction(groupId: string, transName: string, type: string): Observable<{transaction: Transaction, members: Member[]}>{

    return this.http2.post(
      host + '/groups/' + groupId + '/transactions/',
      {transaction: {name: transName, type: type}},
      {headers: this.getHeaders2()})
      .map((data) => {
      return {
        transaction: Transaction.JSONtoObject(data['transaction']),
        members: data['members'].map(m => Member.JSONtoObject(m))
      };
    });
  }

  updateTransaction(groupId: string, transId: string, transaction: Transaction): Observable<Transaction> {

    return this.http2.put(
      host + '/groups/' + groupId + '/transactions/' + transId,
      {transaction: transaction},
      {headers: this.getHeaders2()}
    ).map(res => Transaction.JSONtoObject(res['transaction']));

  }

  updateGroup(id: string, name: string): Observable<Group> {

    return this.http2
      .put(
        host + '/groups/' + id,
        {group: {name: name}},
        {observe: 'response', headers: this.getHeaders2()})
      .map(res => Group.JSONtoObject(res.body['group']));
  }

  addMember(id: string, member: { name: string }): Observable<Member[]> {
    return this.http2.post(host + '/groups/' + id + '/members', {member: member}, {observe: 'response', headers: this.getHeaders2()})
      // .map(res => Member.JSONtoObject(res.body['member']))
      .map(res => res.body['group'].members.map(m => Member.JSONtoObject(m)));

  }

  updateMember(id: string, member: { id: string, name: string }): Observable<Member[]> {
    return this.http2.put(
      host + '/groups/' + id + '/members/' + member.id,

      {member: member},
      {observe: 'response', headers: this.getHeaders2()})
      .map(res => res.body['group'].members.map(m => Member.JSONtoObject(m)));

  }

  deleteMember(groupId: string, memberId: string): Observable<Member[]> {
    return this.http2.delete(host + '/groups/' + groupId + '/members/' + memberId, {observe: 'response', headers: this.getHeaders2()})
      .map(res => res.body['group'].members.map(m => Member.JSONtoObject(m)));
  }

////////// ws edw
  // --------------------------------------------------------------
  addUser(id: string, user: { email: string }): Observable<User[]> {
    return this.http2.post(host + '/groups/' + id + '/users', {user: user}, {observe: 'response', headers: this.getHeaders2()})
      .map(res => res.body['group'].users.map(u => User.JSONtoObject(u)));
  }

  deleteUser(groupId: string, userId: string): Observable<User[]> {
    console.log('HTTP call DELETE /group/users');
    // this.groups[index].members.push(new Member(memberName));
    return this.http2.delete(host + '/groups/' + groupId + '/users/' + userId, {observe: 'response', headers: this.getHeaders2()})
      .map(res => res.body['group'].users.map(u => User.JSONtoObject(u)));
  }

  // --------------------------------------------------------------

  // JUST FOR HISTORICAL REFERENCE
  // private handleError<T>(operation = 'operation', result?: T) {
  //   return (error: any): Observable<T> => {
  //
  //     return of(result as T);
  //   };
  // }


}
