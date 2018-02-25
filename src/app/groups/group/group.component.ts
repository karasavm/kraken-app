import {AfterViewChecked, Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {NavigationService} from '../../shared/services/navigation.service';


declare var $: any;
// import * as $ from 'jquery';


// declare var $:any;
// import * as jQuery from 'jquery';
import {HeaderService} from '../../header/header.service';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from "../../models/user.model";
import {GroupService} from "../group.service";
import {Subscription} from "rxjs/Subscription";
import {MaterializeAction} from "angular2-materialize";
import {FormArray} from "@angular/forms";
import dict from "../../shared/dictionary";
import {Group} from "../../models/group.model";
import {ToastMessagesService} from "../../shared/services/toast-messages.service";
import {isCurrentUser} from "../../shared/helper";
// $ = jQuery;



@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit, OnDestroy {


  group: Group;
  modalActions = new EventEmitter<string|MaterializeAction>();
  isCurrentUser = isCurrentUser;

  constructor(private navService: NavigationService,
              private headerService: HeaderService,
              private groupService: GroupService,
              private router: Router,
              private toastService: ToastMessagesService,
              private route: ActivatedRoute) { }

  ngOnInit() {


    // this.headerService.setGroupId(this.route.snapshot.paramMap['params']['id']);
    // this.headerService.showTabs();
    // this.headerService.setState('group', this.route.snapshot.paramMap['params']['id'])

    //
    // $(document).ready(function(){
    //   $('ul.tabs').tabs();
    //   console.log("dddddddddddddddddddddddddddddddddddddddddddd")
    // });

    // this.subscription = this.groupService.usersChanged
    //   .subscribe((users)=> {
    //     this.groupUsers = users;
    //     this.checked = true;
    //     console.log("checked")
    //   })

    this.headerService.onClickCollaboration
      .subscribe((data) => {
        console.log("on click collaporation event")
        this.group = this.groupService.getGroupValue();
        console.log(this.group);
        this.openModal();
    });



  }

  openModal() {
    this.modalActions.emit({action:"modal",params:['open']});
  }
  closeModal() {
    this.modalActions.emit({action:"modal",params:['close']});
  }


  // -----------------------------   USERS HANDLING ------------------------
  onClickAddUser(f) {

    const email = f.value.email;

    if (email) {
      // Save Member
      this.groupService.addUser(this.group.id, {email: email})
        .subscribe((users) => {
            this.group.users = users;
            this.groupService.setGroupValue(this.group);
            f.reset();
          }, (err) => {
          f.reset();
          this.toastService.error(dict['user.add.error']);
        });
    }
  }


  onClickDeleteUser(user: User) {
    this.groupService.deleteUser(this.group.id, user.id)
      .subscribe((users) =>
        {
          this.group.users = users;
          this.groupService.setGroupValue(this.group);
        },
        (err) => {
          this.toastService.error(dict['user.delete.error']);
        });
  }
  // ------------------------------------------------------------------------

  ngOnDestroy() {
  }

}
