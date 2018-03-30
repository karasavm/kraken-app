import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material";
import {User} from "../../../../models/user.model";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {GroupService} from "../../../group.service";
import dict from "../../../../shared/dictionary";
import {ToastMessagesService} from "../../../../shared/services/toast-messages.service";
import {Group} from "../../../../models/group.model";

@Component({
  selector: 'app-link-email-modal',
  templateUrl: './link-email-modal.component.html',
  styleUrls: ['./link-email-modal.component.css']
})
export class LinkEmailModalComponent implements OnInit {

  email: string;
  friends: User[];
  group: Group;
  memberId;
  searchTerm$ = new Subject<string>();
  foundUser: User[];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private groupService: GroupService,
    private toastService: ToastMessagesService,
  ) {

    this.friends = this.data['friends'];
    this.group = this.data['group'];
    this.memberId = this.data['memberId'];
    this.search(this.searchTerm$)
      .subscribe(results => {

        this.foundUser = results;
      });
  }

  ngOnInit() {

    this.foundUser = null;
  }

  onClickAdd(f, user: User) {

    const body = {email: user.email};

    if (this.memberId) {
      // link member to user
      this.groupService.linkMember(this.group.id, this.memberId, user.email)
        .subscribe((members) => {
          this.group.members = members;
          this.groupService.setGroupValue(this.group);
          if (f) {
            // case of add searched user
            f.reset();
            this.foundUser = null;
          }

        }, (err) => {
          this.toastService.error(dict['member.link.error']);
        })
    } else {
      // add user
      this.groupService.addMember(this.group.id, body)
        .subscribe((members) => {

          // this.group.members = members;
          // this.groupService.setGroupValue(this.groupId);
          this.group.members = members;
          this.groupService.setGroupValue(this.group);
          // f.reset();
          if (f) {
            // case of add searched user
            f.reset();
            this.foundUser = null;
          }
        }, (err) => {
          // f.reset();
          this.toastService.error(dict['member.add.error']);
        });
    }



  }

  filteredFriends() {

    let res = [];

    for (let i=0; i < this.friends.length; i++) {
      let found = false;
      for (let j=0; j < this.group.members.length; j++) {

        if (this.group.members[j].user && this.group.members[j].user.id === this.friends[i].id) {
          found = true;
          break
        }
      }

      if (!found) {
        res.push(this.friends[i]);
      }
    }

    return res;

  }
  search(terms: Observable<string>) {
    return terms
      .debounceTime(500)
      .distinctUntilChanged()
      .switchMap(term => this.groupService.searchUsers(term));
  }


  searchUsers(term: string) {
    this.foundUser = null;
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (re.test(String(term).toLowerCase())) {
      // email
      this.searchTerm$.next(term);
    }



    // this.groupService.searchUsers(searchKey)
    //   .subscribe((data) => {
    //     console.log(data)
    //   })
  }

  onClickClearSearch(f) {
    f.reset();
    this.foundUser = null;
  }


}
