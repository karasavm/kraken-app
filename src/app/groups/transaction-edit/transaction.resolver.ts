import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';

import {Observable} from 'rxjs/Observable';

import {Subject} from 'rxjs/Subject';
import {Injectable} from '@angular/core';
import {Group} from '../../models/group.model';
import {GroupService} from '../group.service';
import {Transaction} from '../../models/transaction.model';
import {Member} from '../../models/member.model';

@Injectable()
export class TransactionResolver implements Resolve<{transaction: Transaction, members: Member[]}> {

  constructor(private groupService: GroupService) {}

  resolve (route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
  Observable<{transaction: Transaction, members: Member[]}> {

    const id = route.paramMap.get('id');
    const transId = route.paramMap.get('transId');

    return this.groupService.getTransaction(id, transId)
      .take(1)
      .delay(0) //todo: remove delays
      .catch((err) => {
        return Observable.of(null);
      });
  }
}



// this.id = this.route.snapshot.paramMap.get('id');
//
//
// this.subscription = this.groupService.groupsChanged
//   .subscribe(
//     (groups: Group[]) => {
//       const group = groups.find(g => g.id === this.id );
//
//       this.group = group;
//       this.headerService.titleChanged.next(this.group.name);
//       // this.group.transactions.push({title: "aaa", amount: 5})
//     }
//   );
//
//
// this.groupService.loadGroup(this.id);
