import {Component, EventEmitter, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validator} from '@angular/forms';
import {Group} from '../../models/group.model';
import {GroupService} from '../group.service';
import {ActivatedRoute,} from '@angular/router';
import {HeaderService} from '../../header/header.service';
import {Member} from '../../models/member.model';
import {User} from '../../models/user.model';
import {ToastMessagesService} from '../../shared/services/toast-messages.service';
import dict from '../../shared/dictionary';
import {MaterializeAction} from "angular2-materialize";
import {NavigationService} from "../../shared/services/navigation.service";
import {getCurrentUser, isCurrentUser} from "../../shared/helper";
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-group-edit',
  templateUrl: './group-edit.component.html',
  styleUrls: ['./group-edit.component.css']
})
export class GroupEditComponent implements OnInit {

  group: Group;
  id: string;
  modalActions = new EventEmitter<string|MaterializeAction>();
  modalActions2 = new EventEmitter<string|MaterializeAction>();
  messagesDict = {
    deleteGroup: dict["group.delete.prompt_message"],
    leaveGroup: dict["group.leave.prompt_message"]
  };
  memberIdToUpdate = '';
  nameToUpdate = ''; //modale value for edit member and edit group name
  isCurrentUser = isCurrentUser;
  nameUpdateMode: string;  //modal model. update groupname/edit member name

  constructor(
    private groupService: GroupService,
    private route: ActivatedRoute,
    private headerService: HeaderService,
    private toastService: ToastMessagesService,
    private navService: NavigationService
    ) {
  }

  ngOnInit() {


    this.route.data
      .subscribe((data: {group: Group}) => {
        this.group = data['group'];
        this.id = this.group.id;

        this.headerService.setState('settings', this.id, '');
      });
  }



// -------------   z HANDLING ------------------------
  onClickUpdateGroup() {

    this.groupService.updateGroup(this.id, this.nameToUpdate)
    // IT IS USED ONLY TO UPDATE GOUP'S NAME
      .subscribe(

        (group) => {
          this.group = group;
          this.headerService.setState('settings', group.id, group.name);
          this.toastService.success(dict['groupName.update.success']);
          this.closeModal2();
        },
        (err) => {
          this.toastService.error(dict['groupName.update.error']);
        }
      );
  }

  // -------------   MEMBERS HANDLING ------------------------
  onClickAddMember(f) {

    const name = f.value.newMemberName;
    if (name) {
      // Save Member
      this.groupService.addMember(this.id, {name: name})
        .subscribe((members) => {
          this.group.members = members;
          f.reset();
        }, (err) => {
          f.reset();
          this.toastService.error(dict['member.add.error']);
        });
    }
  }


  onClickUpdateMember2(form) {
    const name = this.nameToUpdate;

    if (name) {
      // Save Member
      this.groupService.updateMember(this.id, {id: this.memberIdToUpdate, name: name})
        .subscribe(members => {
          this.group.members = members;
          this.memberIdToUpdate = '';
          this.closeModal2();
          this.toastService.success(dict['member.update.success']);
        }, (err) => {
          this.closeModal2();
          // this.getMembersFormArray().at(i).setValue(this.group.members[i]);
          this.toastService.error(dict['member.update.error']);
        });
      form.reset();
    }
  }


  onClickDeleteMember(index: number, member: Member) {
    this.groupService.deleteMember(this.id, member.id)
      .subscribe((members) => {
          this.group.members = members
      }, (err) => {
        this.toastService.error(dict['member.delete.error']);
        });
  }
  // ---------------------------------------------------------------------------


  // -------------  MODAL ---------------------------------------

  openModal() {
    this.modalActions.emit({action:"modal",params:['open']});
  }
  closeModal() {
    this.modalActions.emit({action:"modal",params:['close']});
  }

  openModal2(mode: string, data: any) {
    console.log("openmodal2")
    this.nameUpdateMode = mode;
    if (mode === 'memberUpdate') {
      const member = data;
      this.memberIdToUpdate = member.id;
      this.nameToUpdate = member.name;

    } else if (mode === 'groupUpdate') {
      this.nameToUpdate = this.group.name;
    }

    this.modalActions2.emit({action:"modal",params:['open']});

  }
  closeModal2() {
    this.memberIdToUpdate = '';
    this.modalActions2.emit({action:"modal",params:['close']});
  }

  onClickDeleteGroup() {
    this.groupService.deleteGroup(this.id)
      .subscribe((data) => {
        this.toastService.success(dict['group.delete.success']);
        this.navService.groupList();
      }, (error) => {
        this.toastService.error(dict['group.delete.error']);
      });
  }

  // delete user
  onClickLeaveGroup() {

    this.groupService.deleteUser(this.id, getCurrentUser().id)
      .subscribe((users) => {
        this.navService.groupList();
        this.toastService.success(dict['user.left.success']);
      }, (err) => {
          this.toastService.error(dict['user.left.error']);
        });
  }


}
