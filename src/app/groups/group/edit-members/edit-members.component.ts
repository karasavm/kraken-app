import { Component, OnInit } from '@angular/core';
import {Group} from "../../../models/group.model";
import {GroupService} from "../../group.service";
import {Member} from "../../../models/member.model";
import dict from "../../../shared/dictionary";
import {User} from "../../../models/user.model";
import {ToastMessagesService} from "../../../shared/services/toast-messages.service";
import {MatDialog, MatDialogRef} from "@angular/material";
import {LinkEmailModalComponent} from "./link-email-modal/link-email-modal.component";
import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";
import {debounceTime} from "rxjs/operator/debounceTime";
import {distinctUntilChanged} from "rxjs/operator/distinctUntilChanged";
import {switchMap} from "rxjs/operator/switchMap";

@Component({
  selector: 'app-edit-members',
  templateUrl: './edit-members.component.html',
  styleUrls: ['./edit-members.component.css']
})
export class EditMembersComponent implements OnInit {

  group: Group;
  dialogRefLinkEmail : MatDialogRef<LinkEmailModalComponent>;
  searchTerm$ = new Subject<string>();
  users: User[];
  foundUser: User;

  constructor(
    private groupService: GroupService,
    private toastService: ToastMessagesService,
    private dialog: MatDialog
  )
  {


    this.search(this.searchTerm$)
      .subscribe(results => {
        this.users = results;
        this.foundUser = results[0];
        console.log("RESULTS", results)
      });
  }

  ngOnInit() {


    this.group = this.groupService.getGroupValue();

    this.groupService.groupChanged.subscribe((group) => {
      this.group = group;
    })



    // this.groupService.getGroup(this.group.id).subscribe((g) => {
    //   console.log("getting group")
    //   setTimeout(() => {
    //     console.log("time ouuuutttttt")
    //     this.group = g
    //   }, 1000)
    //
    // });
  }


  // -----------------------------   MEMBERS HANDLING ------------------------

  onClickAddUser(f, user: User) {



    const body = {email: user.email};

    this.groupService.addMember(this.group.id, body)
      .subscribe((members) => {

        this.group.members = members;
        this.groupService.setGroupValue(this.group);

        f.reset();
        this.users = [];
        this.foundUser = null;
      }, (err) => {
        f.reset();
        this.toastService.error(dict['member.add.error']);
      });


    return;

    // if (memberName) {
    //   let body;
    //
    //   // Save Member
    //   const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //   if (re.test(String(memberName).toLowerCase())) {
    //     // email
    //     body = {email: memberName};
    //   } else {
    //     // virtual
    //     body = {name: memberName}
    //   }
    //
    //
    //   this.groupService.addMember(this.group.id, body)
    //     .subscribe((members) => {
    //
    //       this.group.members = members;
    //       this.groupService.setGroupValue(this.group);
    //       f.reset();
    //     }, (err) => {
    //       f.reset();
    //       this.toastService.error(dict['member.add.error']);
    //     });
    // }
  }

  onClickAddMember(f) {

    const memberName = f.value.member;

    if (memberName) {
      let body;

      // Save Member
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      body = {name: memberName};
      // if (false && re.test(String(memberName).toLowerCase())) {
      //   // email
      //   body = {email: memberName};
      // } else {
      //   // virtual
      //   body = {name: memberName}
      // }


      this.groupService.addMember(this.group.id, body)
        .subscribe((members) => {

          this.group.members = members;
          this.groupService.setGroupValue(this.group);
          f.reset();
        }, (err) => {
          f.reset();
          this.toastService.error(dict['member.add.error']);
        });
    }
  }

  onClickUnlinkMember(member: Member) {
    this.groupService.unlinkMember(this.group.id, member.id)
      .subscribe((members) =>
        {
          this.group.members = members;
          this.groupService.setGroupValue(this.group);
        },
        (err) => {
          this.toastService.error(dict['member.unlink.error']);
        });
  }




  onClickDeleteMember(member: Member) {
    this.groupService.deleteMember(this.group.id, member.id)
      .subscribe((members) =>
        {
          this.group.members = members;
          this.groupService.setGroupValue(this.group);
        },
        (err) => {
          this.toastService.error(dict['member.delete.error']);
        });
  }
  // ----------------------MODALS----------------------------------------

  onClickLinkEmail(member: Member) {
    console.log(member);
    this.dialogRefLinkEmail = this.dialog.open(LinkEmailModalComponent, {
      data: {memberId: member.id, groupId: this.group.id}
    });
  }

  search(terms: Observable<string>) {
    return terms
      .debounceTime(500)
      .distinctUntilChanged()
      .switchMap(term => this.groupService.searchUsers(term));
  }


  searchUsers(term: string) {

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
    this.users = [];
    this.foundUser = null;


  }


  onClickLinkMember(f, user, member) {

    this.groupService.linkMember(this.group.id, member.id, user.email)
      .subscribe((members) => {
        this.group.members = members;
        this.groupService.setGroupValue(this.group);

        f.reset();
        this.users = [];
        this.foundUser = null;
      }, (err) => {
        f.reset();
        this.toastService.error(dict['member.link.error']);
      })
  }

  foundUserExists() {
    const that = this;
    return this.group.getUserMembers().findIndex(function(m) {
      return m.user.id === that.foundUser.id;
    }) !== -1;
  }

}
