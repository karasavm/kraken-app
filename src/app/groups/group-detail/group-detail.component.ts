import {Component, EventEmitter, OnInit, TemplateRef} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {Group} from '../../models/group.model';
import {GroupService} from '../group.service';
import {HeaderService} from '../../header/header.service';
import {Subscription} from 'rxjs/Subscription';
import {Transaction} from '../../models/transaction.model';
import {FormControl, FormGroup} from '@angular/forms';
import {NavigationService} from '../../shared/services/navigation.service';
import {MaterializeAction} from 'angular2-materialize';
import {ToastMessagesService} from '../../shared/services/toast-messages.service';
import dict from '../../shared/dictionary';

@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.css']
})

export class GroupDetailComponent implements OnInit {

  group: Group;
  subscription: Subscription;
  myForm: FormGroup;
  id: string;
  searched_transactions: Transaction[];
  modalActions = new EventEmitter<string|MaterializeAction>();

  constructor(private groupService: GroupService,
              private headerService: HeaderService,
              private route: ActivatedRoute,
              private router: Router,
              private navService: NavigationService,
              private toastService: ToastMessagesService) {


  }

  onSearch(key) {
    this.searched_transactions = this.group.transactions
      .filter(t => t.name.toLowerCase().indexOf(key.toLowerCase()) !== -1);
  }
  ngOnInit() {



    this.route.data
      .subscribe((data: {group: Group}) => {
        this.group = data['group'];
        this.id = this.group.id;
        this.searched_transactions = this.group.transactions;
        // this.headerService.titleChanged.next(this.group.name);
        this.headerService.setState('transactions', this.id, this.group.name);
      });

    this.constructForm();
  }

  onClickCreateTransaction() {
    this.groupService.createTransaction(this.group.id, this.myForm.get('name').value)
      .subscribe((data) => {

        this.navService.transaction(this.group.id, data.transaction.id);
        this.closeModal();
        this.toastService.success(dict['transaction.create.success']);

      }, (err) => {
        this.toastService.error(dict['transaction.create.error']);
        this.closeModal()
      });
  }

  openModal() {
    this.modalActions.emit({action:"modal",params:['open']});
  }
  closeModal() {
    this.modalActions.emit({action:"modal",params:['close']});
  }

  constructForm() {
    this.myForm = new FormGroup({
      name: new FormControl('')
    });
  }
}
