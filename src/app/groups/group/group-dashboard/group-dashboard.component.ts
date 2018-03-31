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
  neg2 = [];
  neg = [];
  pos = [];
  pos2 = [];
  selected = [];
  newDebt: number;
  subscription: Subscription;
  noParticipantsMsg = dict['group.nomembers'];
  currentDebt: number;

  // dashboard
  dashboard;
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
    let pos2 = [];
    let neg = [];
    let neg2 = [];


    for (var memberId in this.debts) {

      if (this.debts[memberId].debt < 0) {
        neg.push({
          memberId: memberId,
          debt: this.debts[memberId].debt
        });

        neg2.push({
          memberId: memberId,
          debt: Math.abs(this.debts[memberId].debt),
          checked: false,
          debtToShow: Math.abs(this.debts[memberId].debt)
        });
      } else if (this.debts[memberId].debt > 0 ){
        pos.push({
          memberId: memberId,
          debt: this.debts[memberId].debt,
          debtToShow: this.debts[memberId].debt,
          checked: false
        });

        pos2.push({
          memberId: memberId,
          debt: this.debts[memberId].debt,
          checked: false,
          debtToShow: this.debts[memberId].debt,

        });

      }
    }

    this.neg = neg;
    this.neg2 = neg2;
    this.pos2 = pos2;
    this.pos = pos;



    this.initDashboard();


    // this.selectedNeg = this.neg2[0];
    // for (let i=0; i < this.neg2.length; i++) {
    //   if(this.neg2[i].memberId === this.group.getCurrentMember().id) {
    //     this.selectedNeg = this.neg2[i];
    //     break;
    //   }
    // }
    // this.initCollapsibleHeader();



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


      // this.updatedUnceckedOptions(v);
    }

    // this.dashboard = dashboard;
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

  negChanged() {
    return -1 !== this.pos.findIndex(function (v) {
      return v.checked;
    })
  }

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

  openFirst() {
    this.actions1.emit({action:"collapsible",params:['open',0]});
  }

  closeFirst() {
    this.actions1.emit({action:"collapsible",params:['close',0]});
  }

  owes(memberId) {
    for (let i=0 ; i<this.neg2.length;i++) {
      if (this.neg2[i].memberId === memberId){
        return true
      }
    }

    for (let i=0 ; i<this.pos2.length;i++) {
      if (this.pos2[i].memberId === memberId){
        return false
      }
    }


  }

  posCurrent;
  selectedNeg;
  onClickCollapsible(m) {
    this.selectedNeg = m;

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


    // index of posCurrent
    // if (p.checked) {
    //   this.selectedNeg.debtToShow += p.debtToShow;
    //   console.log('+')
    // } else {
    //   console.log('-')
    //   this.selectedNeg.debtToShow -= p.debtToShow;
    // }
    // p.checked = !p.checked;
    //
    // // update the unchecked options
    // console.log(this.posCurrent, 'kllllll', this.selectedNeg)
    // for (let i=0; i < this.posCurrent.length; i++) {
    //
    //   if (this.posCurrent[i].debt >= this.selectedNeg.debtToShow && !this.posCurrent[i].checked) {
    //     this.posCurrent[i].debtToShow = this.selectedNeg.debtToShow;
    //   } else if (this.posCurrent[i].debt < this.selectedNeg.debtToShow && !this.posCurrent[i].checked){
    //     this.posCurrent[i].debtToShow = this.posCurrent[i].debt;
    //   }
    //
    // }



  }

  initCollapsibleHeader() {

    // Initiallization Process
    let m = this.selectedNeg;
    for (let i=0; i < this.neg2.length; i++) {
      this.neg2[i].debtToShow = this.neg2[i].debt;
    }

    for (let i=0; i < this.pos2.length; i++) {
      this.pos2[i].debtToShow = this.pos2[i].debt;
    }


    this.posCurrent = this.pos2.slice(0);

    for (let i=0; i < this.posCurrent.length; i++) {
      this.posCurrent[i].checked = false;
      if (this.posCurrent[i].debt > m.debt) {
        this.posCurrent[i].debt = m.debt;
      }

    }
  }

  onClickDone(index) {
    for (let i=0; i < this.dashboard.neg[index].options.length; i++) {

      if (this.dashboard.neg[index].options[i].checked) {
        console.log(
          this.group.getCurrentMember(),
          this.dashboard.neg[index].options[i].memberId,
          this.dashboard.neg[index].options[i].debtToShow
        );

        this.groupService.createTransaction(
          this.group.id,
          'Payment Back',
          'give',
          Transaction.transferToPayments(
            this.selectedNeg.memberId,
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
