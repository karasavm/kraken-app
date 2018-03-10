import {
  AfterViewChecked, Component, ElementRef, EventEmitter, OnDestroy, OnInit, ViewChild,
  ViewChildren
} from '@angular/core';
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
import {getCurrentUser, isCurrentUser} from "../../shared/helper";
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
  headerButton = '';
  // modals
  nameToUpdate= '';
  messagesDict = {
    deleteGroup: dict["group.delete.prompt_message"],
    leaveGroup: dict["group.leave.prompt_message"]
  };


  constructor(private navService: NavigationService,
              private headerService: HeaderService,
              private groupService: GroupService,
              private router: Router,
              private toastService: ToastMessagesService,
              private route: ActivatedRoute) { }

  ngOnInit() {

    this.route.data
      .subscribe((data: {group: Group}) => {
        this.group = data['group'];
        this.groupService.setGroupValue(this.group);
      });


    this.subscription = this.headerService.onClickHeaderButton
      .subscribe((button) => {
        this.headerButton = button;

        // init according to pressed button
        if (this.headerButton === 'edit-name') {
          this.nameToUpdate = this.group.name;
        }


        this.openModal();
    });



  }
  // MODAL
  openModal() {
    Materialize.updateTextFields();
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

  // ------------------------------- MEMBER HANDLIGN ---------------------
  onClickUpdateGroup(f) {
    this.groupService.updateGroup(this.group.id, this.nameToUpdate)
    // IT IS USED ONLY TO UPDATE GOUP'S NAME
      .subscribe(

        (group) => {
          this.group = group;
          this.groupService.setGroupValue(group);
          this.toastService.success(dict['groupName.update.success']);
          this.closeModal();

        },
        (err) => {
          this.toastService.error(dict['groupName.update.error']);
        }
      );
  }
  // -----------------------------------------------------------

  onClickDeleteGroup() {
    this.groupService.deleteGroup(this.group.id)
      .subscribe((data) => {
        this.toastService.success(dict['group.delete.success']);
        this.navService.groupList();
      }, (error) => {
        this.toastService.error(dict['group.delete.error']);
      });
  }

  onClickLeaveGroup() {

    this.groupService.deleteUser(this.group.id, getCurrentUser().id)
      .subscribe((users) => {

        this.group.users = users;
        this.groupService.setGroupValue(this.group);
        this.navService.groupList();
        this.toastService.success(dict['user.left.success']);
      }, (err) => {
        this.toastService.error(dict['user.left.error']);
      });
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
