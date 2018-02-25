import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HeaderService} from '../../header/header.service';
import {GroupService} from '../group.service';
import {Group} from '../../models/group.model';

@Component({
  selector: 'app-group-dashboard',
  templateUrl: './group-dashboard.component.html',
  styleUrls: ['./group-dashboard.component.css']
})
export class GroupDashboardComponent implements OnInit {

  group: Group;
  id: string;
  debts: any;
  nameChangeLog: string[] = [];

  constructor(
    private groupService: GroupService,
    private route: ActivatedRoute,
    private headerService: HeaderService,
  ) {}

  ngOnInit() {
    this.route.data
      .subscribe((data: {group: Group}) => {
        this.group = data['group'];
        this.id = this.group.id;
        // this.headerService.titleChanged.next(this.group.name);
        this.headerService.setState('dashboard', this.id, this.group.name);
        this.debts = this.group.calcDebts();

        this.groupService.setGroupValue(this.group);
      });




  }
}
