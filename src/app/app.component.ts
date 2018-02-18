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

//todo: when fail to sign up there is an error, redirects to sign in after sign in
//todo: notification messaged when update and delete success
//todo: when logged in can not navigate to singin/register
//todo: delete buttons
//todo: use table on transaction edit
//todo: dekadika stoggulopoihsh
//todo: hmerominies sta transaction
//todo: tooltip on new transaction/transfer
//todo: Memembers
//todo:strogullopoihsh
//todo: autocomplete off on signin/signup forms
//todo: after sign in redirects always on /groups
//

// BUGS
//todo: back arrow does not work on full browser screen



// DONE FEATURES
//tabs shifting when big screen
//ashboat table bgainei apo ta oria
//one click to delete a member
//transfer
//member selection on transactions

// DONE BUGS
// new empty transfer issue on transaction list


// Προφανώς και δεν θέλω να σε ενοχλώ από το μεσεντζερ,
// ούτε και την ώρα που δουλεύεις.
// Θέλω απλά να βγω μαζί σου για ένα ποτό
// χωρίς να χαλάω το βαρύ πρόγραμμά σου.
// Όταν έχεις χρόνο και όρεξη για αυτό, ξέρεις πλέον πού θα με βρεις
