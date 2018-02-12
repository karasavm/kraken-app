import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {NavigationService} from '../../shared/services/navigation.service';


declare var $: any;
// import * as $ from 'jquery';


// declare var $:any;
// import * as jQuery from 'jquery';
import {HeaderService} from '../../header/header.service';
import {ActivatedRoute, Router} from '@angular/router';
// $ = jQuery;



@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {

  constructor(private navService: NavigationService,
              private headerService: HeaderService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {


    // this.headerService.setGroupId(this.route.snapshot.paramMap['params']['id']);
    // this.headerService.showTabs();
    // this.headerService.setState('group', this.route.snapshot.paramMap['params']['id'])

    //
    // $(document).ready(function(){
    //   $('ul.tabs').tabs();
    //   console.log("dddddddddddddddddddddddddddddddddddddddddddd")
    // });
  }

}
