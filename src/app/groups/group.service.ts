import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import {Group} from '../models/group.model';
import {Member} from '../models/member.model';


import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {Router} from '@angular/router';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from '@angular/common/http';
import {tap} from 'rxjs/operators';
import {Transaction} from '../models/transaction.model';
import {AuthService} from '../auth/auth.service';
import {User} from '../models/user.model';
import {environment} from "../../environments/environment";
import {HeaderService} from "../header/header.service";
import {of} from "rxjs/observable/of";


@Injectable()
export class GroupService {
  usersChanged = new Subject<User[]>();
  groupChanged = new Subject<Group>();

  groupUsers: User[];
  group: Group;
  // private groups: Group[] = GROUPS;
  private groups: Group[] = [];

  constructor(private router: Router,
              private http2: HttpClient,
              private authService: AuthService,
              private headerService: HeaderService
  ) {

  }


  // new HttpHeaders().set('Authorization', 'my-auth-token'),
  private getHeaders2() {
    return new HttpHeaders().set('Authorization', this.authService.retriveToken());
  }

  //////////////
  setGroupValue(group: Group, updateTitle=true) {
    console.log("Setting group value")
    this.group = group;

    if (true || updateTitle) {
      this.headerService.setTitle(this.group.name);
    }

    this.groupChanged.next(this.group);
  }

  getGroupValue() {
    return this.group;
  }
  ////////////////////


  // API Handlers
  getGroups(): Observable<Group[]> {
    return this.http2
      .get(environment.apiHost + '/groups', {headers: this.getHeaders2()})
      .map(data => data['groups'].map(g => Group.JSONtoObject(g)))
      .pipe(
        tap(groups => {} )
      );
  }

  createGroup(name: string): Observable<Group> {

    return this.http2.post(
      environment.apiHost + '/groups',
      {group: {name: name}},
      {observe: 'response', headers: this.getHeaders2()})
      .map(res => Group.JSONtoObject(res.body['group']))
      .pipe(
        tap(groups => {} )
      );
  }


  getGroup(id: string): Observable<Group> {
    return this.http2
      .get(environment.apiHost + '/groups/' + id, {observe: 'response', headers: this.getHeaders2()})
      .map(res => Group.JSONtoObject(res.body['group']))
      .pipe(
        tap(groups => {} )
      );
  }

  // deleteGroup(id: string): Observable<any> {
  //   return this.http2
  //     .delete(environment.apiHost + '/groups/' + id, {observe: 'response', headers: this.getHeaders2()})
  // }



  getTransaction(groupId: string, transId: string): Observable<{transaction: Transaction, members: Member[]}> {
    return this.http2
      .get(
        environment.apiHost + '/groups/' + groupId + '/transactions/' + transId,
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
        environment.apiHost + '/groups/' + groupId + '/transactions/' + transId,
        {headers: this.getHeaders2()})
  }



  createTransaction(groupId: string, transName: string, type: string, payments = []): Observable<{transaction: Transaction, members: Member[]}>{
    console.log(payments, "dskfjklsdjflkdsjfkldjsfkldjlksjdlkjfklj")
    return this.http2.post(
      environment.apiHost + '/groups/' + groupId + '/transactions/',
      {transaction: {name: transName, type: type, payments: payments}},
      {headers: this.getHeaders2()})
      .map((data) => {
        return {
          transaction: Transaction.JSONtoObject(data['transaction']),
          members: data['members'].map(m => Member.JSONtoObject(m))
        };
      });
  }

  updateTransaction(groupId: string, transId: string, transaction: Transaction): Observable<Transaction> {
    console.log("ddd",transaction)
    return this.http2.put(
      environment.apiHost + '/groups/' + groupId + '/transactions/' + transId,
      {transaction: transaction},
      {headers: this.getHeaders2()}
    ).map(res => Transaction.JSONtoObject(res['transaction']));

  }

  updateGroup(id: string, name: string): Observable<Group> {

    return this.http2
      .put(
        environment.apiHost + '/groups/' + id,
        {group: {name: name}},
        {observe: 'response', headers: this.getHeaders2()})
      .map(res => Group.JSONtoObject(res.body['group']));
  }

  // ---------------------- MEMBERS ----------------------
  addMember(id: string, member: { name: string } | { email: string } ): Observable<Member[]> {

    return this.http2.post(environment.apiHost + '/groups/' + id + '/members', {member: member}, {observe: 'response', headers: this.getHeaders2()})
    // .map(res => Member.JSONtoObject(res.body['member']))
      .map(res => res.body['group'].members.map(m => Member.JSONtoObject(m)));

  }

  updateMember(id: string, member: { id: string, name: string }): Observable<Member[]> {
    return this.http2.put(
      environment.apiHost + '/groups/' + id + '/members/' + member.id,

      {member: member},
      {observe: 'response', headers: this.getHeaders2()})
      .map(res => res.body['group'].members.map(m => Member.JSONtoObject(m)));

  }

  deleteMember(groupId: string, memberId: string): Observable<Member[]> {
    return this.http2.delete(environment.apiHost + '/groups/' + groupId + '/members/' + memberId, {observe: 'response', headers: this.getHeaders2()})
      .map(res => res.body['group'].members.map(m => Member.JSONtoObject(m)));
  }

  linkMember(groupId: string, memberId: string, email: string): Observable<Member[]> {

    const body = {member: {email: email}};
    return this.http2.put(environment.apiHost + '/groups/' + groupId + '/members/' + memberId, body, {observe: 'response', headers: this.getHeaders2()})
      .map(res => res.body['group'].members.map(m => Member.JSONtoObject(m)));
  }

  unlinkMember(groupId: string, memberId: string): Observable<Member[]> {
    const body = {member: {email: ''}};
    return this.http2.put(environment.apiHost + '/groups/' + groupId + '/members/' + memberId, body, {observe: 'response', headers: this.getHeaders2()})
      .map(res => res.body['group'].members.map(m => Member.JSONtoObject(m)));
  }
  // ------------------------------------------------------------------


////////////////
  // --------------------------------------------------------------
  addUser(id: string, user: { email: string }): Observable<User[]> {
    return this.http2.post(environment.apiHost + '/groups/' + id + '/users', {user: user}, {observe: 'response', headers: this.getHeaders2()})
      .map(res => res.body['group'].users.map(u => User.JSONtoObject(u)));
  }

  deleteUser(groupId: string, userId: string): Observable<User[]> {
    console.log('HTTP call DELETE /group/users');
    // this.groups[index].members.push(new Member(memberName));
    return this.http2.delete(environment.apiHost + '/groups/' + groupId + '/users/' + userId, {observe: 'response', headers: this.getHeaders2()})
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

  getFriends(): Observable<User[]> {
    return this.http2
      .get(environment.apiHost + '/helper/friends', {headers: this.getHeaders2()})
      .map(data => data['users'].map(u => User.JSONtoObject(u)))

  }

  searchUsers(term: string): Observable<User[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }

    return this.http2
      .get<User[]>(environment.apiHost + `/helper/users/?searchKey=${term}`, {headers: this.getHeaders2()})
      .map(res => res['users'].map(u => User.JSONtoObject(u)))
      .pipe(
        tap(_ => console.log(`found users matching "${term}"`)),
      )

  }

}
