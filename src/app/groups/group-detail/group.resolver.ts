import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';

import {Observable} from 'rxjs/Observable';
import {Injectable} from '@angular/core';
import {Group} from '../../models/group.model';
import {GroupService} from '../group.service';
import {NavigationService} from '../../shared/services/navigation.service';

@Injectable()
export class GroupResolver implements Resolve<Group> {

  constructor(
    private groupService: GroupService,
    private navService: NavigationService ) {}

  resolve (route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
  Observable<Group> {

    const id = route.parent.paramMap.get('id');
    return this.groupService.getGroup(id)
      .take(1)
      .delay(0) //todo: remove delay
      .catch((err) => {
        this.navService.groupList();
        return Observable.of(null);
      });
  }
}



