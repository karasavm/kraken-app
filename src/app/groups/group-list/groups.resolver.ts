import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';

import {Observable} from 'rxjs/Observable';

import {Subject} from 'rxjs/Subject';
import {Injectable} from '@angular/core';
import {Group} from '../../models/group.model';
import {GroupService} from '../group.service';

@Injectable()
export class GroupsResolver implements Resolve<Group[]> {

  constructor(private groupService: GroupService) {}

  resolve (route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
  Observable<Group[]> {

    return this.groupService.getGroups()
      .take(1)
      .catch((err) => {
        return Observable.of([]);
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
