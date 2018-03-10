import { Component, OnInit } from '@angular/core';
import {Group} from "../../../models/group.model";
import {GroupService} from "../../group.service";
import {Member} from "../../../models/member.model";
import dict from "../../../shared/dictionary";
import {User} from "../../../models/user.model";
import {ToastMessagesService} from "../../../shared/services/toast-messages.service";

@Component({
  selector: 'app-edit-members',
  templateUrl: './edit-members.component.html',
  styleUrls: ['./edit-members.component.css']
})
export class EditMembersComponent implements OnInit {

  group: Group;

  constructor(
    private groupService: GroupService,
    private toastService: ToastMessagesService
  ) { }

  ngOnInit() {


    this.group = this.groupService.getGroupValue();

    this.groupService.groupChanged.subscribe((group) => {
      this.group = group;
    })


    // this.groupService.getGroup(this.group.id).subscribe(g => this.group = g);
  }


  // -----------------------------   MEMBERS HANDLING ------------------------
  onClickAddMember(f) {

    const memberName = f.value.member;

    if (memberName) {
      // Save Member
      this.groupService.addMember(this.group.id, {name: memberName})
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
  // ------------------------------------------------------------------------

}
