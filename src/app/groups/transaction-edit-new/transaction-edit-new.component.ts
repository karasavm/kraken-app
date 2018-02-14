import {Component, EventEmitter, OnInit} from '@angular/core';
import {GroupService} from '../group.service';
import {Member} from '../../models/member.model';
import {AbstractControl, FormArray, FormBuilder, FormGroup, NgForm, ValidatorFn, Validators} from '@angular/forms';
import {NavigationService} from '../../shared/services/navigation.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Transaction} from '../../models/transaction.model';
import {Payment} from '../../models/payments.model';
import {nulling, unnull} from '../../shared/helper';
import {HeaderService} from '../../header/header.service';
import {ToastMessagesService} from '../../shared/services/toast-messages.service';
import dict from '../../shared/dictionary';
import {MaterializeAction} from "angular2-materialize";


interface FormPayment {

  member: string;
  amount: {value: number, disabled: boolean};
  auto: {value: boolean, disabled: boolean};
  debt: {value: number, disabled: boolean};
}
@Component({
  selector: 'app-transaction-edit-new',
  templateUrl: './transaction-edit-new.component.html',
  styleUrls: ['./transaction-edit-new.component.css']
})
export class TransactionEditNewComponent implements OnInit {

  members: Member[];
  myForm: FormGroup;
  transaction: Transaction;
  groupId: string;
  transId: string;
  modalActions = new EventEmitter<string|MaterializeAction>();
  auto = true;
  paymentsTotal = 0;
  messagesDict = {deleteTrans: dict['transaction.delete.prompt_message']};

  // TRANSFERS
  fromTransfer: string;
  toTransfer: string;
  amountTransfer: number;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private groupService: GroupService,
              private navService: NavigationService,
              private headerService: HeaderService,
              private toastService: ToastMessagesService) {

  }

  ngOnInit() {


    this.route.data.subscribe((data) => {
      this.groupId = this.route.snapshot.paramMap.get('id');
      this.transId = this.route.snapshot.paramMap.get('transId');
      this.transaction = data['transData']['transaction'];
      this.members = data['transData']['members'];
      this.headerService.setState('transaction', this.groupId, this.transaction.name);

      if (this.transaction.type === 'general') {
        this.initForm();
      } else if(this.transaction.type === 'give') {
        // payments.push({member: from, amount: amount, debt: 0});
        // payments.push({member: to, amount: 0, debt: amount});

        if (this.transaction.payments.length !== 0) {

          const transfer = Transaction.paymentsToTransfer(this.transaction.payments);
          this.fromTransfer = transfer.from;
          this.toTransfer = transfer.to;
          this.amountTransfer = transfer.amount;
        }

      }
    });

  }


  validator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
      // const forbidden = nameRe.test(control.value);

      const paymentsForm = (control as FormArray);
      let sumAmount = 0;
      let sumManual = 0;

      for (let i = 0; i < paymentsForm.controls.length; i++) {
        sumAmount += unnull(paymentsForm.controls[i].get('amount').value);

        if (paymentsForm.controls[i].get('auto').value === false) {
          sumManual += unnull(paymentsForm.controls[i].get('debt').value);
        }

      }

      console.log(sumAmount, sumManual);

      console.log("VALIDATOR", sumAmount, sumManual);


      if (sumAmount < sumManual) {
        return {"wrong_payments" : "true"};

      }

      return null;

      // return forbidden ? {'forbiddenName': {value: control.value}} : null;
    };

  }
  setAutoValues(payments) {

    let sumAmount = 0;
    let sumManual = 0;
    let numAuto = 0;
    for (let i = 0; i < payments.length; i++) {
      sumAmount += unnull(payments[i].amount);
      sumManual += !payments[i].auto ? unnull(payments[i].debt) : 0;
      numAuto += payments[i].auto ? 1 : 0;

    }

    // at least one auto
    if (numAuto > 0) {
      let valueAuto = (sumAmount - sumManual) / numAuto;

      for (let i = 0; i < (this.myForm.get('payments') as FormArray).controls.length; i++) {
        const paymentGroup = (this.myForm.get('payments') as FormArray).controls[i];

        // negative is when sum(manual) > sum(amount) => invalid form
        valueAuto = valueAuto <= 0 ? 0 : valueAuto;

        if (paymentGroup.get('auto').value && paymentGroup.enabled) {
          paymentGroup.patchValue({debt: nulling(valueAuto)}, {emitEvent: false});
        }
      }
    }

    this.paymentsTotal = unnull(sumAmount);


  }

  initForm() {


    const paymentsFG = [];

    // create active payments
    for (let i = 0; i < this.transaction.payments.length; i++) {
      const gr = this.formBuilder
        .group(this.paymentToFormPayment(this.transaction.payments[i]));
      paymentsFG.push(gr);
    }

    // create inactive payments
    // a payment is inactive when a member does not exists on transaction.payments[]
    for (let i = 0; i < this.members.length; i++) {
      const found = this.transaction.payments
        .findIndex(p => p.member === this.members[i].id);
      if (found === -1) {
        // default payment
        const gr = this.formBuilder.group(
          this.getDefaultFormPayment(this.members[i].id)
        );
        gr.disable();
        paymentsFG.push(gr);
      }
    }


    this.myForm = this.formBuilder.group({
      name: [this.transaction.name],
      payments: []
    });

    console.log("initialization finished")
    // set payments in Form
    this.myForm.setControl(
      'payments',
      this.formBuilder.array(paymentsFG, this.validator())
    );

    console.log("payments assigned ok")
    // this.setAutoValues(this.myForm.get('payments').value);
  }

  getPaymentsFormArray() {
    return (this.myForm.get('payments') as FormArray).controls;
  }

  paymentToFormPayment(p: Payment): FormPayment {

    const amount = p.amount !== 0 ? p.amount : nulling(0),
      debt = nulling(p.debt),
      isAuto = debt === -1;

    return {
      member: p.member,
      amount: {value: amount, disabled: false},
      auto: {value: isAuto, disabled: false},
      debt: {value: debt > 0 ? debt : nulling(0), disabled: isAuto}
    };
  }

  getDefaultFormPayment(member: string): FormPayment {
    return {
      member: member,
      amount: {value: nulling(0), disabled: false},
      auto: {value: true, disabled: false},
      debt: {value: nulling(0), disabled: true}  // auto=true => debt=disabled
    };
  }


  onClickAutoManual(payment) {
    // toggle disable
    if (payment.get('auto').enabled) {
      if (payment.get('auto').value) {
        payment.get('debt').disable();
      } else {
        payment.get('debt').enable();
      }
    }

    // set manual value to null
    if (!payment.get('auto').value) {
      payment.patchValue({debt: null});
    }
  }

  enableGroup(payment) {
    payment.enable();
    if (payment.get('auto').value) {
      payment.get('debt').disable();
    }
  }

  enableAmount(payment: FormGroup, focus) {
    if (payment.disabled){
      // payment.get('amount')
      // console.log(focus.focus())
      this.enableGroup(payment);

    }
  }
  toggleGroupDisable(payment: FormGroup) {
    if (payment.disabled) {
      this.enableGroup(payment);
    } else {
      payment.disable();
    }

    // this.toggleAutoDisable(payment);
  }



  getMemberById(id: string) {
    return this.members.find(m => m.id === id);
  }

  onClickSave() {
    this.groupService.updateTransaction(
      this.groupId,
      this.transId,
      this.myForm.value
    ).subscribe((trans) => {
      this.toastService.success(dict['transaction.save.success']);
      this.navService.groupDashboard(this.groupId);
    }, (err) => {
      this.toastService.error(dict['transaction.save.error']);
    });
  }

  // -------------  MODAL ---------------------------------------

  openModal() {
    this.modalActions.emit({action:"modal",params:['open']});
  }
  closeModal() {
    this.modalActions.emit({action:"modal",params:['close']});
  }

  // ------------------------------------------------------------


  // ------------------------ TRANSFERS -------------------------



  onClickTransferSave(form: NgForm) {


    const from = form.value.fromSelection;
    const to = form.value.toSelection;
    const amount = form.value.amount;

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

  // onSigin(form: NgForm) {
  //
  //   console.log("SignIn Form",form);
  //   const email = form.value.email;
  //   const password = form.value.password;
  //   this.authService.loginUser(email, password);
  // }
  // ------------------------------------------------------------
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

}


//form validation
//todo: total >0
//total = all debts
