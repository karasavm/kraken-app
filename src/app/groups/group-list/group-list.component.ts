import {Component, EventEmitter, HostListener, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {GroupService} from '../group.service';
import {HeaderService} from '../../header/header.service';
import {FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Group} from '../../models/group.model';
import {NavigationService} from '../../shared/services/navigation.service';
import {MaterializeAction} from 'angular2-materialize';
import {ToastMessagesService} from '../../shared/services/toast-messages.service';
import dict from '../../shared/dictionary';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css'],
})
export class GroupListComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  subscription1: Subscription;

  groups: Group[];
  groupForm: FormGroup;
  modalActions = new EventEmitter<string|MaterializeAction>();

  constructor(
    private groupService: GroupService,
    private headerService: HeaderService,
    private router: Router,
    private navService: NavigationService,
    private route: ActivatedRoute,
    private toastService: ToastMessagesService
  ) {

  }



  ngOnInit() {

    // this.headerService.hideGroupTabs();
    // this.headerService.setDefault();

    this.subscription = this.route.data
      .subscribe((data: Group[] ) => {
        this.groups = data['groups'];
      });

    // this.subscription1 = this.headerService.onClickRenewGroupsButton
    //   .subscribe((data) => {
    //     this.groupService.getGroups().subscribe(groups => this.groups = groups);
    //   });

    this.constructForm();

  }



  onClickCreateGroup() {
    this.closeModal();
    this.groupService.createGroup(this.groupForm.get('name').value)
      .subscribe((group) => {
        this.toastService.success(dict['group.create.success']);
        this.navService.groupTransactions(group.id);
      }, (err) => {

        this.toastService.error(dict['group.create.error']);
      });


  }

  openModal() {
    this.modalActions.emit({action:"modal",params:['open']});
  }
  closeModal() {
    this.modalActions.emit({action:"modal",params:['close']});
  }

  constructForm() {
    this.groupForm = new FormGroup({
      name: new FormControl('')
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // ----------------- swipe down to reload -----------------
  touch1 = {x:0,y:0,time:0};
  @HostListener('touchstart', ['$event'])
  @HostListener('touchend', ['$event'])
  //@HostListener('touchmove', ['$event'])
  @HostListener('touchcancel', ['$event'])

  handleTouch(ev){
    var touch = ev.touches[0] || ev.changedTouches[0];
    if (ev.type === 'touchstart'){
      this.touch1.x = touch.pageX;
      this.touch1.y = touch.pageY;
      this.touch1.time = ev.timeStamp;
    } else if (ev.type === 'touchend'){
      var dx = touch.pageX - this.touch1.x;
      var dy = touch.pageY - this.touch1.y;
      var dt = ev.timeStamp - this.touch1.time;

      if (dt < 500){

        // swipe lasted less than 500 ms
        if (Math.abs(dx) > 60){
          // delta x is at least 60 pixels
          if (dx > 0){
            // this.doSwipeLeft(ev);
          } else {
            // this.doSwipeRight(ev);
          }
        }

        if (Math.abs(dy) > 250){
          // delta x is at least 60 pixels
          if (dy > 0){
            this.doSwipeDown(ev);
          } else {
            // this.doSwipeUp(ev);
          }
        }
      }
    }
  }
  doSwipeDown(ev) {
    const that = this;
    this.groupService.getGroups().subscribe(groups => that.groups = groups);
  }
}
