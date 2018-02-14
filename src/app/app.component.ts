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
}

// TODOLIST New Features

//todo: order by on transactions
//todo: error messages
//todo: member selection on transactions
//todo: when fail to sign up there is an error, redirects to sign in after sign in
//todo: notification messaged when update and delete success
//todo: when logged in can not navigate to singin/register
//todo: delete buttons
//todo: use table on transaction edit
//todo: one click to delete a member
//todo: dekadika stoggulopoihsh
//todo: hmerominies sta transaction
//todo: pills sto transactions

//todo: back arrow does not work on full browser screen
//todo: transfer
//todo: Memembers
//todo:strogullopoihsh
//todo: autocomplete off on signin/signup forms

//

// BUGS
// todo: back button disappeared on chrome

// DONE
//tabs shifting when big screen
//ashboat table bgainei apo ta oria
