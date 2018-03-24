import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HeaderService} from '../../../header/header.service';
import {GroupService} from '../../group.service';
import {Group} from '../../../models/group.model';
import {Subscription} from "rxjs/Subscription";
import dict from "../../../shared/dictionary";

@Component({
  selector: 'app-group-dashboard',
  templateUrl: './group-dashboard.component.html',
  styleUrls: ['./group-dashboard.component.css']
})
export class GroupDashboardComponent implements OnInit, OnDestroy {

  group: Group;
  debts: any;
  subscription: Subscription;
  noParticipantsMsg = dict['group.nomembers'];

  constructor(
    private groupService: GroupService,
    private route: ActivatedRoute,
    private headerService: HeaderService,
  ) {}

  ngOnInit() {

    this.initOnData(this.groupService.getGroupValue());
    this.subscription = this.groupService.groupChanged
      .subscribe( (group) => {
        // this.groupService.setGroupValue(group);
        this.initOnData(group);

        // this.group = group;

        // this.headerService.setState('dashboard', this.group.id, this.group.name); //todo: check this after migration
        // this.debts = this.group.calcDebts();
      });
  }

  initOnData(group) {

    this.group = group;
    this.headerService.setTitle(this.group.name);
    this.debts = this.group.calcDebts();



    //todo: how to solve the debts
    let pos = {};
    let neg = {};
    for (var memberId in this.debts) {

      if (this.debts[memberId].debt < 0) {
        neg[memberId] = this.debts[memberId];
      } else if (this.debts[memberId].debt > 0 ){
        pos[memberId] = this.debts[memberId];
      }
    }

    for (var n in neg) {

      for (var p in pos) {

        if (-1*neg[n].debt > pos[p].debt) {
          console.log(group.getMemberById(n).name, group.getMemberById(p).name, pos[p].debt)
        } else {
          console.log(group.getMemberById(n).name, group.getMemberById(p).name, -1*neg[n].debt)
        }

      }
    }





  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


}
