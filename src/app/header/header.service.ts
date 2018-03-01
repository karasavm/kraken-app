import {EventEmitter, Injectable} from '@angular/core';
import { Subject } from 'rxjs/Subject';


interface State {
  stateName: string;
  groupId: string;
  title: string;
}


@Injectable()
export class HeaderService {

  curTitle: string;
  stateChanged = new Subject<State>();

  onClickCollaboration = new EventEmitter();
  onClickTransactionSave = new EventEmitter();

  setState(stateName: string, groupId: string = '', title: string = '') {
    this.stateChanged.next({
      stateName: stateName,
      groupId: groupId,
      title: title
    });
  }

  constructor() {
  }


}
