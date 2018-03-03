import {Component, OnInit} from '@angular/core';
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'app';

  name = 'mike';
  showSpinner = false;

  constructor(
              private router: Router) {

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

  }

  handler(event) {
    console.log(event," fffffff")
  }
}

// TODOLIST New Features

//todo: order by on transactions
//todo: error messages sign up


//todo: dekadika stoggulopoihsh
//todo: hmerominies sta transaction


//todo:strogullopoihsh
//todo: autocomplete off on signin/signup forms
//todo: email account for forgot password
//todo: forgot password pages
//

// BUGS
//todo: back arrow does not work on full browser screen
// todo: null name error at login page
// todo: not fixed pages on some components after compile


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
// new empty transfer issue on transaction list
// when logged in can not navigate to singin/register
// when fail to sign up there is an error, redirects to sign in after sign in
