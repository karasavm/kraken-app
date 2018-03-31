import {Component, EventEmitter, HostListener, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HeaderService} from '../../../header/header.service';
import {GroupService} from '../../group.service';
import {Group} from '../../../models/group.model';
import {Subscription} from "rxjs/Subscription";
import dict from "../../../shared/dictionary";
import {getCurrentUser} from "../../../shared/helper";
import {User} from "../../../models/user.model";
import {MaterializeAction} from "angular2-materialize";
import {Transaction} from "../../../models/transaction.model";

@Component({
  selector: 'app-group-dashboard',
  templateUrl: './group-dashboard.component.html',
  styleUrls: ['./group-dashboard.component.css']
})
export class GroupDashboardComponent implements OnInit, OnDestroy {

  group: Group;
  currentUser: User;
  debts: any;
  neg = [];
  pos = [];
  selected = [];
  subscription: Subscription;
  noParticipantsMsg = dict['group.nomembers'];
  currentDebt: number;

  // dashboard
  dashboard;

  // COLLAPSIBLE
  actions1 = new EventEmitter<string|MaterializeAction>();


  params = [
    {
      onOpen: (el) => {
        // this.initDashboard();
        // this.initCollapsibleHeader();
      },
      onClose: (el) => {
        // console.log("Collapsible close", el);
        // this.initCollapsibleHeader();
        this.resetDashboard()

      }
    }
  ];
  values = ["First", "Second", "Third"];

  constructor(
    private groupService: GroupService,
    private route: ActivatedRoute,
    private headerService: HeaderService,
  ) {}




  ngOnInit() {
    this.currentUser = getCurrentUser();


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

    let pos = [];
    let neg = [];


    for (var memberId in this.debts) {

      if (this.debts[memberId].debt < 0) {
        neg.push({
          memberId: memberId,
          debt: this.debts[memberId].debt
        });

      } else if (this.debts[memberId].debt > 0 ){
        pos.push({
          memberId: memberId,
          debt: this.debts[memberId].debt,
          debtToShow: this.debts[memberId].debt,
          checked: false
        });

      }
    }

    this.neg = neg;
    this.pos = pos;

    this.initDashboard();

  }

  resetDashboard() {


    for (let i=0; i < this.dashboard.neg.length; i++) {

      let v = {
        memberId: this.neg[i].memberId,
        debt: Math.abs(this.neg[i].debt),
        debtToShow: Math.abs(this.neg[i].debt),
        options: []
      };


      this.dashboard.neg[i].debtToShow = this.dashboard.neg[i].debt;

      for (let j=0 ; j < this.dashboard.neg[i].options.length; j++) {

        if (this.dashboard.neg[i].options[j].debt > this.dashboard.neg[i].debt) {
          this.dashboard.neg[i].options[j].debtToShow = this.dashboard.neg[i].debt;
        } else {
          this.dashboard.neg[i].options[j].debtToShow = this.dashboard.neg[i].options[j].debt;
        }
        this.dashboard.neg[i].options[j].checked = false;
      }
    }
  }

  initDashboard() {
    let dashboard = {
      neg: [],
      pos: []
    };

    for (let i=0; i < this.neg.length; i++) {

      let v = {
        memberId: this.neg[i].memberId,
        debt: Math.abs(this.neg[i].debt),
        debtToShow: Math.abs(this.neg[i].debt),
        options: []
      };

      for (let j=0 ; j < this.pos.length; j++) {
        v.options.push({
          memberId: this.pos[j].memberId,
          debt: this.pos[j].debt,
          checked: false,
          debtToShow: this.pos[j].debt,
        });
      }

      dashboard.neg.push(v);

      this.updatedUnceckedOptions(v);
    }

    this.dashboard = dashboard;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  openFirst() {
    this.actions1.emit({action:"collapsible",params:['open',0]});
  }

  closeFirst() {
    this.actions1.emit({action:"collapsible",params:['close',0]});
  }


  updatedUnceckedOptions(currentNeg) {
    for (let i=0; i <  currentNeg.options.length; i++) {
      if (!currentNeg.options[i].checked) {
        if (currentNeg.options[i].debt > currentNeg.debtToShow) {
          currentNeg.options[i].debtToShow = currentNeg.debtToShow;
        } else {
          currentNeg.options[i].debtToShow = currentNeg.options[i].debt;
        }
      }
    }
  }
  onClickChecked(currentNeg, selectedP) {

    selectedP.checked = !selectedP.checked;

    if (selectedP.checked) {
      currentNeg.debtToShow -= selectedP.debtToShow;
    } else {
      currentNeg.debtToShow += selectedP.debtToShow;
    }

    this.updatedUnceckedOptions(currentNeg);
  }



  onClickDone(index) {
    for (let i=0; i < this.dashboard.neg[index].options.length; i++) {

      if (this.dashboard.neg[index].options[i].checked) {

        this.groupService.createTransaction(
          this.group.id,
          'Payment Back',
          'give',
          Transaction.transferToPayments(
            this.dashboard.neg[index].memberId,
            this.dashboard.neg[index].options[i].memberId,
            this.dashboard.neg[index].options[i].debtToShow
          )
        )
          .subscribe((data) => {

            this.group.transactions.reverse().push(data.transaction);
            this.group.transactions = this.group.transactions.reverse();
            this.groupService.setGroupValue(this.group);
          })


      }
    }
  }

}
