import { Injectable } from '@angular/core';
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


  setState(stateName: string, groupId: string = '', title: string = '') {
    console.log("setting state")
    this.stateChanged.next({
      stateName: stateName,
      groupId: groupId,
      title: title
    });
  }

  constructor() {
  }


}
