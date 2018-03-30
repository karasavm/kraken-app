import {
  AfterViewChecked, Component, ElementRef, EventEmitter, HostListener, OnDestroy, OnInit, ViewChild,
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
import {MatDialog, MatDialogRef} from "@angular/material";
import {EditMembersComponent} from "./edit-members/edit-members.component";
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

  dialogRefEditMembers : MatDialogRef<EditMembersComponent>;

  // swipe down to reload
  touch1 = {x:0,y:0,time:0};
  @HostListener('touchstart', ['$event'])
  @HostListener('touchend', ['$event'])
  //@HostListener('touchmove', ['$event'])
  @HostListener('touchcancel', ['$event'])

  handleTouch(ev){
    var touch = ev.touches[0] || ev.changedTouches[0];
    if (ev.type === 'touchstart'){
      this.touch1.x = touch.pageX;
      this.touch1.y = touch.pageY;
      this.touch1.time = ev.timeStamp;
    } else if (ev.type === 'touchend'){
      var dx = touch.pageX - this.touch1.x;
      var dy = touch.pageY - this.touch1.y;
      var dt = ev.timeStamp - this.touch1.time;

      if (dt < 500){

        // swipe lasted less than 500 ms
        if (Math.abs(dx) > 60){
          // delta x is at least 60 pixels
          if (dx > 0){
            // this.doSwipeLeft(ev);
          } else {
            // this.doSwipeRight(ev);
          }
        }

        if (Math.abs(dy) > 250){
          // delta x is at least 60 pixels
          if (dy > 0){
            this.doSwipeDown(ev);
          } else {
            // this.doSwipeUp(ev);
          }
        }
      }
    }
  }
  doSwipeDown(ev) {
    const that = this;
    this.groupService.getGroup(this.group.id).subscribe(function (g) {
      that.group = g;
      that.groupService.setGroupValue(g);
    });
  }


  // doSwipeRight(ev) {
  //   // return;
  //   this.navService.groupTransactions(this.group.id);
  // }
  //
  // doSwipeLeft(ev) {
  //   // this.temp -= 5;
  //   // return;
  //
  //   this.navService.groupDashboard(this.group.id);
  // }

  constructor(private navService: NavigationService,
              private headerService: HeaderService,
              private groupService: GroupService,
              private router: Router,
              private toastService: ToastMessagesService,
              private route: ActivatedRoute,
              private dialog: MatDialog
  ) { }

  ngOnInit() {

    this.route.data
      .subscribe((data: {group: Group}) => {
        this.group = data['group'];
        this.groupService.setGroupValue(this.group, true);
      });


    this.subscription = this.headerService.onClickHeaderButton
      .subscribe((button) => {
        this.headerButton = button;

        // init according to pressed button
        if (this.headerButton === 'edit-name') {
          this.nameToUpdate = this.group.name;
        }

        // update group before modal opens
        this.groupService.getGroup(this.group.id).subscribe((g) => {

          setTimeout(() => {
            this.group = g;
            this.nameToUpdate = this.group.name;
            this.groupService.setGroupValue(this.group);

          }, 100);

          // this.openModal();
        });

        // this.openModal()

        if (this.headerButton === 'edit-member') {
          this.openDialogEditMembers();
        } else {
          this.openModal();
        }

        // this.openModal();
    });



  }
  // MODAL
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

  openDialogEditMembers( ) {
    this.dialogRefEditMembers = this.dialog.open(EditMembersComponent);
  }


}
