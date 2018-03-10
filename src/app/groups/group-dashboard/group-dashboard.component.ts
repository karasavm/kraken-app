import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HeaderService} from '../../header/header.service';
import {GroupService} from '../group.service';
import {Group} from '../../models/group.model';
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'app-group-dashboard',
  templateUrl: './group-dashboard.component.html',
  styleUrls: ['./group-dashboard.component.css']
})
export class GroupDashboardComponent implements OnInit, OnDestroy {

  group: Group;
  debts: any;
  subscription: Subscription;

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
    this.debts = this.group.calcDebts();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


}
