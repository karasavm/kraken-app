import {Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {Transaction} from "../../models/transaction.model";
import {FormBuilder, FormGroup} from "@angular/forms";
import {HeaderService} from "../../header/header.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NavigationService} from "../../shared/services/navigation.service";
import {ToastMessagesService} from "../../shared/services/toast-messages.service";
import {GroupService} from "../group.service";
import dict from "../../shared/dictionary";
import {Member} from "../../models/member.model";
import {MaterializeAction} from "angular2-materialize";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'app-transaction-edit-temp',
  templateUrl: './transaction-edit-temp.component.html',
  styleUrls: ['./transaction-edit-temp.component.css']
})
export class TransactionEditTempComponent implements OnInit, OnDestroy {

  members: Member[];
  transaction: Transaction;
  groupId: string;
  transId: string;
  subscription: Subscription;
  auto = true;
  paymentsTotal = 0;

  // FORMS
  checked = false;
  payments = [];
  currentPage = 2;
  //

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private groupService: GroupService,
              private navService: NavigationService,
              private headerService: HeaderService,
              private toastService: ToastMessagesService) { }

  ngOnInit() {


    this.route.data.subscribe((data) => {
      this.groupId = this.route.snapshot.paramMap.get('id');
      this.transId = this.route.snapshot.paramMap.get('transId');
      this.transaction = data['transData']['transaction'];
      this.members = data['transData']['members'];
      this.headerService.setState('transaction', this.groupId, this.transaction.name);

      if (this.transaction.type === 'general') {

      } else if(this.transaction.type === 'give') {
        // payments.push({member: from, amount: amount, debt: 0});
        // payments.push({member: to, amount: 0, debt: amount});

      }

      ///////////////////////
      this.initPayments();
    });

    this.subscription = this.headerService.onClickTransactionSave.subscribe((data) => {
      if (this.transactionIsValid()) {

        this.transaction.payments = this.getCheckedPayments();
        console.log(this.transaction.payments)
        this.groupService.updateTransaction(
          this.groupId,
          this.transId,
          this.transaction
        ).subscribe((trans) => {
          this.toastService.success(dict['transaction.save.success']);
          this.navService.groupDashboard(this.groupId);
        }, (err) => {
          this.toastService.error(dict['transaction.save.error']);
        });

      } else {
        this.toastService.error(dict['transaction.save.error.invalid']);
      }
    })

  }

  togglePayment(i) {
    //todo: maybe we need to reset payment when becomes unchecked
    this.payments[i].checked = !this.payments[i].checked;
  }
  initPayments() {


    for(let i=0; i < this.members.length; i++) {
      this.payments.push({
        member: this.members[i].id,
        amount: null,
        // amount: 5,
        debt: null,
        checked: false
      })
    }

    for(let i=0; i < this.transaction.payments.length; i++) {
      for(let j=0; j < this.payments.length; j++) {

        if (this.transaction.payments[i].member === this.payments[j].member) {
          this.payments[j].amount = this.transaction.payments[i].amount;
          this.payments[j].debt = this.transaction.payments[i].debt;

          if (this.payments[j].debt == -1) {
            this.payments[j].debt = null;// auto functionality
          }
          this.payments[j].checked = true;
        }
      }
    }
  }

  checkedPaymentsNum() {
    let sum = 0;

    for (let i=0; i < this.payments.length; i++) {
      if (this.payments[i].checked) {
        sum ++;
      }
    }

    return sum;
  }

  amountPaymentsSum() {
    let sum = 0;

    for (let i=0; i < this.payments.length; i++) {
      if (this.payments[i].checked) {
        sum += this.payments[i].amount;
      }
    }

    return sum;
  }

  getCheckedPayments() {
    return this.payments.filter(p => p.checked);
  }
  transactionIsValid() {
    if (this.checkedPaymentsNum() === 0 || this.amountPaymentsSum() === 0 ) {
      return false;
    } else {return true;}
  }

  getMemberById(id: string) {
    return this.members.find(m => m.id === id);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
//todo: check that total amount equal with total has to pay


