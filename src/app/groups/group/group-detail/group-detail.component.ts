import {Component, EventEmitter, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {Group} from '../../../models/group.model';
import {GroupService} from '../../group.service';
import {HeaderService} from '../../../header/header.service';
import {Subscription} from 'rxjs/Subscription';
import {Transaction} from '../../../models/transaction.model';
import {FormControl, FormGroup} from '@angular/forms';
import {NavigationService} from '../../../shared/services/navigation.service';
import {MaterializeAction} from 'angular2-materialize';
import {ToastMessagesService} from '../../../shared/services/toast-messages.service';
import dict from '../../../shared/dictionary';

@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.css']
})

export class GroupDetailComponent implements OnInit, OnDestroy {

  group: Group;
  noParticipantsMsg = dict['group.nomembers'];
  subscription: Subscription;
  myForm: FormGroup;
  id: string;
  searched_transactions: Transaction[];
  modalActions1 = new EventEmitter<string|MaterializeAction>();
  modalActions2 = new EventEmitter<string|MaterializeAction>();
  selectedMembers = [];
  searchKey: '';
  routeNames = ["Buttons", "Carousel", "Chips", "Collapsible", "Dialogs", "Dropdown", "Forms", "Tabs", "DatePicker", "Parallax", "ModelBindings"];

  actions1 = new EventEmitter<string|MaterializeAction>();
  params = [
    {
      onOpen: (el) => {
        // console.log("Collapsible open", el);
      },
      onClose: (el) => {
        // console.log("Collapsible close", el);
      }
    }
  ];

  constructor(private groupService: GroupService,
              private headerService: HeaderService,
              private route: ActivatedRoute,
              private router: Router,
              public navService: NavigationService,
              private toastService: ToastMessagesService) {





  }




  ngOnInit() {

    this.initOnData(this.groupService.getGroupValue());

    this.constructForm();

    this.subscription = this.groupService.groupChanged.subscribe((group) => {
      this.initOnData(group);
    })
  }

  initOnData(group) {
    this.group = group;
    this.searched_transactions = this.group.transactions;
  }

  onClickCreateTransaction(id) {

    const name = id === 1 ? this.myForm.get('name').value : 'Transfer';
    const type = id === 1 ? 'general' : 'give';
    this.groupService.createTransaction(
      this.group.id,
      name,
      type
    )
      .subscribe((data) => {
        this.navService.transaction(this.group.id, data.transaction.id);
        this.closeModal(id);
        this.toastService.success(dict['transaction.create.success']);
      }, (err) => {
        this.toastService.error(dict['transaction.create.error']);
        this.closeModal(id)
      });
  }

  openModal(id: number) {
    if (id ===1 ) {
      this.modalActions1.emit({action: "modal", params: ['open']});
    } else {
      this.modalActions2.emit({action: "modal", params: ['open']});
    }
  }
  closeModal(id: number) {
    if (id === 1) {
      this.modalActions1.emit({action: "modal", params: ['close']});
    } else {
      this.modalActions2.emit({action: "modal", params: ['close']});
    }
  }

  constructForm() {
    this.myForm = new FormGroup({
      name: new FormControl('')
    });
  }

  // TRANSFERS
  getFromNameTransfer(payments) {
    const transfer =  Transaction.paymentsToTransfer(payments);
    if (transfer.from) {
      return this.group.getMemberById(transfer.from).name;
    } else {
      return '';
    }
  }

  getToNameTransfer(payments) {
    const transfer =  Transaction.paymentsToTransfer(payments);
    if (transfer.to) {
      return this.group.getMemberById(transfer.to).name;
    } else {
      return '';
    }
  }

  // -----------------TRANSACTIONS FILTERS
  onClickResetFilters() {
    this.selectedMembers = [];
    this.searchKey = '';
    this.searched_transactions = this.group.transactions;

  }

  filterTransactions() {

    let searched = this.group.transactions.slice();

    if (this.searchKey) {
      searched = searched
        .filter(t => t.name.toLowerCase().indexOf(this.searchKey.toLowerCase()) !== -1);
    }

    if (this.selectedMembers.length > 0) {
      searched = searched
        .filter((t) => {
          for (let i=0; i < t.payments.length; i++) {
            for (let j=0; j < this.selectedMembers.length ; j++) {
              if (t.payments[i].member === this.selectedMembers[j]) {
                return true;
              }
            }
          }
          return false;
        })
    }

    this.searched_transactions = searched;

  }
  // --------------------------------------

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
