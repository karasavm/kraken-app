import {EventEmitter, Injectable} from '@angular/core';
import { Subject } from 'rxjs/Subject';


interface State {
  stateName: string;
  groupId: string;
  title: string;
}


@Injectable()
export class HeaderService {


  onClickCollaboration = new EventEmitter();
  onClickEditMembers = new EventEmitter();
  onClickTransactionSave = new EventEmitter();

  onClickHeaderButton = new EventEmitter<string>();
  onClickRenewGroupsButton = new EventEmitter<any>();

  saveTransactionBtnDisabledChanged = new EventEmitter<boolean>();
  saveTransactionBtnDisabled: boolean = false;

  titleChanged = new Subject<string>();

  constructor() {
  }

  setTitle(title) {
    this.titleChanged.next(title);
  }

  setSaveBtnDisabled(status: boolean) {
    this.saveTransactionBtnDisabled = status;
    this.saveTransactionBtnDisabledChanged.next(status);
  }

}
