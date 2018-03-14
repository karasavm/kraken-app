import {Component, OnInit} from '@angular/core';
import {
  ActivatedRoute, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Route,
  Router
} from '@angular/router';
import {NavigationService} from "./shared/services/navigation.service";
import { trigger, style, animate, transition } from '@angular/animations';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({transform: 'translateX(100%)', opacity: 0}),
          animate('500ms', style({transform: 'translateX(0)', opacity: 1}))
        ]),
        transition(':leave', [
          style({transform: 'translateX(0)', opacity: 1}),
          animate('500ms', style({transform: 'translateX(100%)', opacity: 0}))
        ])
      ]
    )
  ],
})
export class AppComponent implements OnInit{
  title = 'app';
  show = false;
  name = 'mike';
  showSpinner = false;



  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private navService: NavigationService) {

    // Assign the selected theme name to the `theme` property of the instance of ToastyConfig.
    // Possible values: default, bootstrap, material
    this.router.events
      .filter(e => {
        return (e instanceof NavigationStart)
          || (e instanceof NavigationEnd ||
            e instanceof NavigationCancel ||
            e instanceof NavigationError);
      })
      .map(e => (e instanceof NavigationStart))
      .distinctUntilChanged()
      .subscribe(showSpinner => {
        this.showSpinner = showSpinner;
      });
  }

  ngOnInit() {
    this.router.events
      .filter((event) => event instanceof NavigationEnd)
      .map(() => this.activatedRoute)

      .map((route) => {
        while (route.firstChild) route = route.firstChild;
        return route;
      })
      .filter((route) => route.outlet === 'primary')
      // .mergeMap((route) => route.data)
      .subscribe((route) => {

        const routeName = route.snapshot.data['routeName'];
        let data = {};

        // traverse tree to fetch route params and data for title
        let params = {};
        while (route.parent) {

          // route params
          if (route.snapshot.params['id']) {
            params['id'] = route.snapshot.params['id'];
          }
          if (route.snapshot.params['transId']) {
            params['transId'] = route.snapshot.params['transId'];
          }

          // route data transactioName or GroupName
          if (route.snapshot.data['group']) {
            data['title'] = route.snapshot.data['group']['name'];
          }

          if (route.snapshot.data['transData']) {
            data['title'] = route.snapshot.data['transData']['transaction']['name'];
          }
          route = route.parent;
        }
        this.navService.setRouteStatus(routeName, params, data);
      });

  }

  handler(event) {
    console.log(event," fffffff")
  }



}

// TODOLIST New Features


//todo: backend ----------------     push group creator on group.users -- only leave group functionality -- remove delete group end point -- find usages on front end
//todo: order by on transactions
//todo: error messages sign up
//todo: change modal to mat-dialog especial these with auto focus
//todo: dropdown with mat- angular io

//todo: dekadika stoggulopoihsh
//todo: hmerominies sta transaction

//todo: MIGRATE MATERIALIZECSS TO MATERIAL IO INPUTS/MODALS/DROPDOWNS

//todo:strogullopoihsh
//todo: autocomplete off on signin/signup forms
//todo: email account for forgot password
//todo: forgot password pages
//todo: refresh button on /groups page
//todo: deprecate DELETE /group/:id chech where it used. only leave
// BUGS
// todo: back arrow does not work on android app
// todo: null name error at login page
// todo: group namde does not updated when edit name modal ok

// DONE FEATURES
// tabs shifting when big screen
// ashboat table bgainei apo ta oria
// one click to delete a member
// transfer
// member selection on transactions
// delete buttons
// notification messaged when update and delete success
// tooltip on new transaction/transfer

// DONE BUGS
// back arrow does not work on full browser screen
// not fixed pages on some components after compile
// new empty transfer issue on transaction list
// when logged in can not navigate to singin/register
// when fail to sign up there is an error, redirects to sign in after sign in
