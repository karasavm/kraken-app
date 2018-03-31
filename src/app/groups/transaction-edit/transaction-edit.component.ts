import {Component, EventEmitter, OnChanges, OnDestroy, OnInit, ViewChild, ViewChildren} from '@angular/core';
import {Transaction} from "../../models/transaction.model";
import {FormBuilder, FormGroup, NgForm} from "@angular/forms";
import {HeaderService} from "../../header/header.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NavigationService} from "../../shared/services/navigation.service";
import {ToastMessagesService} from "../../shared/services/toast-messages.service";
import {GroupService} from "../group.service";
import dict from "../../shared/dictionary";
import {Member} from "../../models/member.model";
import {MaterializeAction} from "angular2-materialize";
import {Subscription} from "rxjs/Subscription";
import {nulling} from "../../shared/helper";

@Component({
  selector: 'app-transaction-edit-temp',
  templateUrl: './transaction-edit.component.html',
  styleUrls: ['./transaction-edit.component.css']
})
export class TransactionEditComponent implements OnInit, OnDestroy, OnChanges {

  members: Member[];
  transaction: Transaction;
  groupId: string;
  transId: string;
  subscription: Subscription;
  auto = true;
  paymentsTotal = 0;
  modalActions = new EventEmitter<string|MaterializeAction>();
  messagesDict = {deleteTrans: dict['transaction.delete.prompt_message']};

  // FORMS
  payments = [];
  currentPage = 1;
  equalCost = true;
  actions1 = new EventEmitter<string|MaterializeAction>();

  // TRANSFERS
  fromTransfer: string;
  toTransfer: string;
  amountTransfer: number;
  transferForm: any;

  params = [
    {
      onOpen: (el) => {
        console.log("Collapsible open", el);
      },
      onClose: (el) => {
        console.log("Collapsible close", el);
      }
    }
  ];


  @ViewChild('carousel') carouselElement;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private groupService: GroupService,
              private navService: NavigationService,
              private headerService: HeaderService,
              private toastService: ToastMessagesService
  ) {}

  ngOnInit() {


    this.route.data.subscribe((data) => {
      this.groupId = this.route.snapshot.paramMap.get('id');
      this.transId = this.route.snapshot.paramMap.get('transId');
      this.transaction = data['transData']['transaction'];
      this.members = data['transData']['members'];

      this.headerService.setTitle(this.transaction.name);

      if (this.transaction.type === 'general') {
        this.initPayments();
        this.onTransactionChange();
      } else if(this.transaction.type === 'give') {

        //TRANSFERS

        if (this.transaction.payments.length !== 0) {

          const transfer = Transaction.paymentsToTransfer(this.transaction.payments);
          this.fromTransfer = transfer.from;
          this.toTransfer = transfer.to;
          this.amountTransfer = transfer.amount;
        }

        this.onTransferChange();

      }

    });

    this.headerService.onClickHeaderButton.subscribe((button) => {

      if (button === 'delete-transaction') {
        this.openModal(); // delete transaction modal
      }

    });

    this.subscription = this.headerService.onClickTransactionSave
      .subscribe((data) => {

        if(this.transaction.type === 'general'){
          if (this.transactionIsValid() === -1) {

            this.transaction.payments = this.getCheckedPayments();
            if (this.equalCost) {
              this.setPaymentsToEqual();
            }
            
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
        } else {
          this.onClickTransferSave()
        }

      })

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

          this.payments[j].amount = nulling(this.transaction.payments[i].amount);

          this.payments[j].debt = this.transaction.payments[i].debt;

          if (this.payments[j].debt == -1) {
            this.payments[j].debt = null;// auto functionality
          } else {
            this.equalCost = false;

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

  debtPaymentsSum() {
    let sum = 0;

    for (let i=0; i < this.payments.length; i++) {
      if (this.payments[i].checked && this.payments[i].debt > 0) {
        sum += this.payments[i].debt;
      }
    }

    return sum;
  }

  getCheckedPayments() {
    return this.payments.filter(p => p.checked);
  }
  setPaymentsToEqual() {
    for (let i=0; i < this.transaction.payments.length; i++) {
      this.transaction.payments[i].debt = null;
    }
  }
  // ------------ VALIDATIONs--------------
  transactionIsValid() {
    if (this.checkedPaymentsNum() === 0) {
      return 1
    } else if (this.amountPaymentsSum() === 0) {
      return 2
    } else if (this.amountPaymentsSum() < this.debtPaymentsSum()) {
      return 3
    }else {
      // valid
      return -1;
    }
  }

  stepIsValid(step) {

    if (step == 1) {
      return this.checkedPaymentsNum() >= 2
    }else if (step == 2) {
      return this.amountPaymentsSum() > 0
    }else if (step == 3) {

    }
  }
  //  -----------------------------------------

  getMemberById(id: string) {
    return this.members.find(m => m.id === id);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  //------------- TRANSFERS -------------------
  onFromChange() {
    this.onTransferChange();
  }
  onToChange() {
    this.onTransferChange();
  }
  onAmountTransferChange() {
    this.onTransferChange();
  }

  onTransferChange() {
    this.headerService.setSaveBtnDisabled(
      !this.transferIsValid()
    );
  }
  onClickTransferSave() {
    const from = this.fromTransfer;
    const to = this.toTransfer;
    const amount = this.amountTransfer;

    if (!this.transferIsValid()) {
      this.toastService.error(dict['transfer.save.error.invalid']);
      return;
    }

    this.transaction.payments = Transaction.transferToPayments(from, to, amount);

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
  }

  onClickDeleteGroup() {

    this.groupService.deleteTransaction(this.groupId, this.transId).subscribe(
      (data) => {
        this.toastService.success(dict['transaction.delete.success']);
        this.navService.groupTransactions(this.groupId);
      }, (err) => {
        this.toastService.error(dict['transaction.delete.error'])
      }
    )
  }
  transferIsValid() {
    if (this.fromTransfer === this.toTransfer || !this.amountTransfer || this.amountTransfer <= 0) {
      return false;
    }
    return true;
  }

  // -------------  MODAL ---------------------------------------

  openModal() {
    this.modalActions.emit({action:"modal",params:['open']});
  }
  closeModal() {
    this.modalActions.emit({action:"modal",params:['close']});
  }

  ngOnChanges() {
    console.log("2222222222222222222222222")

  }

  // ---------------     EDIT TRANSACTION PSEUDOEVENTS
  onCickClearAmount(payment) {
    payment.amount = null;
    this.onTransactionChange();

  }
  onCickClearDebt(payment) {
    payment.debt = null;
    this.onTransactionChange();

  }

  onCheckChange() {
    this.onTransactionChange();
  }


  onAmountChange() {

    this.onTransactionChange();
  }

  onDebtChange() {
    this.onTransactionChange();
  }

  togglePayment(i) {
    this.onTransactionChange();

    //todo: maybe we need to reset payment when becomes unchecked
    this.payments[i].checked = !this.payments[i].checked;
  }

  onTransactionChange() {
    //todo: follow changes on header component
    this.headerService.setSaveBtnDisabled(
      this.transactionIsValid() !== -1
    );
  }
  // ------------------------------------------------------------


}
//todo: check that total amount equal with total has to pay


