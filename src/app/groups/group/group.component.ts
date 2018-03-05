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
  subscription = new Subscription();

  constructor(private navService: NavigationService,
              private headerService: HeaderService,
              private groupService: GroupService,
              private router: Router,
              private toastService: ToastMessagesService,
              private route: ActivatedRoute) { }

  ngOnInit() {

    console.log("inside group component")

    this.route.data
      .subscribe((data: {group: Group}) => {
        console.log("Initial group value has been set");
        this.group = data['group'];
        this.groupService.setGroupValue(this.group);
      });


    this.subscription = this.headerService.onClickCollaboration
      .subscribe((data) => {

        // this.group = this.groupService.getGroupValue();
        this.openModal();
    });



  }

  openModal() {
    this.modalActions.emit({action:"modal",params:['open']});
  }
  closeModal() {
    this.modalActions.emit({action:"modal",params:['close']});
    this.modalActions.emit({action:"modal",params:['close']});
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
    this.subscription.unsubscribe();
  }

}
