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

@Component({
  selector: 'app-group-edit',
  templateUrl: './group-edit.component.html',
  styleUrls: ['./group-edit.component.css']
})
export class GroupEditComponent implements OnInit {

  groupForm: FormGroup;
  group: Group;
  id: string;
  nameChangeLog: string[] = [];
  modalActions = new EventEmitter<string|MaterializeAction>();
  messagesDict = {deleteGroup: dict["group.delete.prompt_message"]};


  constructor(
    private groupService: GroupService,
    private route: ActivatedRoute,
    private headerService: HeaderService,
    private formBuilder: FormBuilder,
    private toastService: ToastMessagesService,
    private navService: NavigationService
    ) {
  }

  ngOnInit() {



    this.route.data
      .subscribe((data: {group: Group}) => {
        this.group = data['group'];
        this.id = this.group.id;
        this.constructForm();
        this.headerService.setState('settings', this.id, '');
      });
  }

  constructForm() {
    this.groupForm = this.formBuilder.group({
      name: this.group.name,
      members: this.formBuilder.array([]),
      newMemberName: new FormControl(''),
      users: this.formBuilder.array([]),
      newUserEmail: new FormControl('')
      // members: new FormArray
    });
    this.setMembersFormArray(this.group.members);
    this.setUsersFormArray(this.group.users);
  }

  logNameChange() {

    const nameControl = this.groupForm.get('name');
    nameControl.valueChanges.forEach(
      (value: string) => this.nameChangeLog.push(value)
    );
  }


// -------------   z HANDLING ------------------------
  onClickUpdateGroup() {

    this.groupService.updateGroup(this.id, this.groupForm.get('name').value)
    // IT IS USED ONLY TO UPDATE GOUP'S NAME
      .subscribe(

        (group) => {
          this.headerService.setState('settings', group.id, group.name);
          this.toastService.success(dict['groupName.update.success']);
        },
        (err) => {
          this.groupForm.get('name').setValue(this.group.name);
          this.toastService.error(dict['groupName.update.error']);
        }
      );
  }

  // -------------   MEMBERS HANDLING ------------------------
  onClickAddMember() {

    const name = this.groupForm.get('newMemberName').value;
    if (name) {
      // Save Member
      this.groupService.addMember(this.id, {name: name})
        .subscribe((members) => {
          this.setMembersFormArray(members);
          this.groupForm.get('newMemberName').reset('');
        }, (err) => {
          this.toastService.error(dict['member.add.error']);
        });
    }
  }

  onClickUpdateMember(i, member) {

    // // const name = this.groupForm.get('newMemberName').value;
    if (member.name) {

      // Save Member
      this.groupService.updateMember(this.id, member)
        .subscribe(members => {
          this.toastService.success(dict['member.update.success']);
        }, (err) => {
          this.getMembersFormArray().at(i).setValue(this.group.members[i]);
          this.toastService.error(dict['member.update.error']);
        });
    }
  }


  onClickDeleteMember(index: number, member: Member) {
    // const index = (this.groupForm.get('members') as FormArray)
    //   .getRawValue().findIndex(v => v.id === member.id);


    this.groupService.deleteMember(this.id, member.id)
      .subscribe(members =>
        (this.groupForm.get('members') as FormArray).removeAt(index),
        (err) => {
        this.toastService.error(dict['member.delete.error']);
        });
  }

  // -----------------------------   USERS HANDLING ------------------------
  onClickAddUser() {

    const email = this.groupForm.get('newUserEmail').value;

    if (email) {
      // Save Member
      this.groupService.addUser(this.id, {email: email})
        .subscribe((users) => {
          this.setUsersFormArray(users);
          this.groupForm.get('newUserEmail').reset('');
        }, (err) => {
          this.toastService.error(dict['user.add.error']);
        });
    }
  }
  onClickDeleteUser(index: number, user: User) {
    this.groupService.deleteUser(this.id, user.id)
      .subscribe(users =>
        (this.groupForm.get('users') as FormArray).removeAt(index),
        (err) => {
        this.toastService.error(dict['user.delete.error']);
        });
  }
  // ------------------------------------------------------------------------

  // -------------    FORMS HELPER FUNCTIONS -------------------------
  getMembersFormArray(): FormArray {
    return this.groupForm.get('members') as FormArray;
  }

  setMembersFormArray(members: Member[]) {
    const membersGA = members.map(member => this.formBuilder.group(member));
    const membersFA = this.formBuilder.array(membersGA);
    this.groupForm.setControl('members', membersFA);
  }

  setUsersFormArray(users: User[]) {
    const usersGA = users.map(user => this.formBuilder.group(user));
    const usersFA = this.formBuilder.array(usersGA);
    this.groupForm.setControl('users', usersFA);
  }
  // ---------------------------------------------------------------------------

  // -------------  MODAL ---------------------------------------

  openModal() {
    this.modalActions.emit({action:"modal",params:['open']});
  }
  closeModal() {
    this.modalActions.emit({action:"modal",params:['close']});
  }

  onClickDeleteGroup() {
    this.groupService.deleteGroup(this.id)
      .subscribe((data) => {
        this.toastService.error(dict['group.delete.success']);
        this.navService.groupList();
      }, (error) => {
        this.toastService.error(dict['group.delete.error']);
      });
  }
}
