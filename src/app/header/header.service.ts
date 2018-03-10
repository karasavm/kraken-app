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

  titleChanged = new Subject<string>();

  constructor() {
  }

  setTitle(title) {
    this.titleChanged.next(title);
  }
}
