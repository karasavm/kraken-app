import { Injectable } from '@angular/core';
import {Subject} from "rxjs/Subject";

@Injectable()
export class LoaderService {


  showSpinnerChanged = new Subject<boolean>();


  constructor(
  ) { }

  showSpinner() {
    this.showSpinnerChanged.next(true);
  }

  hideSpinner() {
    this.showSpinnerChanged.next(false);
  }

}
