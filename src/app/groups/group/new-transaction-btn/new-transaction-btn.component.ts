import {Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {Group} from "../../../models/group.model";
import {GroupService} from "../../group.service";
import {Subscription} from "rxjs/Subscription";
import {MaterializeAction} from "angular2-materialize";
import dict from "../../../shared/dictionary";
import {NavigationService} from "../../../shared/services/navigation.service";
import {ToastMessagesService} from "../../../shared/services/toast-messages.service";

@Component({
  selector: 'app-new-transaction-btn',
  templateUrl: './new-transaction-btn.component.html',
  styleUrls: ['./new-transaction-btn.component.css']
})
export class NewTransactionBtnComponent implements OnInit, OnDestroy {

  group: Group;
  modalActions = new EventEmitter<string|MaterializeAction>();
  subscription: Subscription;
  transactionType: string = '';
  constructor(
    private groupService: GroupService,
    private navService: NavigationService,
    private toastService: ToastMessagesService

  ) {

  }

  ngOnInit() {

    this.initOnData(this.groupService.getGroupValue());


    this.subscription = this.groupService.groupChanged.subscribe((group) => {
      this.initOnData(group);
    })
  }

  initOnData(group) {
    this.group = group;
  }

  openModal(transactionType) {
    this.transactionType = transactionType;
    this.modalActions.emit({action: "modal", params: ['open']});
  }

  closeModal() {
    this.modalActions.emit({action: "modal", params: ['close']});
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }



  onClickCreateTransaction(transName) {

    let name = '';
    let type = '';

    if (transName) {
      // general transaction
      name = transName;
      type = 'general';
    } else {
      // transfer
      name = 'Transfer';
      type = 'give';
    }

    // const name = id === 1 ? this.myForm.get('name').value : 'Transfer';
    // const type = id === 1 ? 'general' : 'give';

    this.groupService.createTransaction(
      this.group.id,
      name,
      type
    )
      .subscribe((data) => {
        this.navService.transaction(this.group.id, data.transaction.id);
        this.closeModal();
        this.toastService.success(dict['transaction.create.success']);
      }, (err) => {
        this.toastService.error(dict['transaction.create.error']);
        this.closeModal()
      });
  }

}
