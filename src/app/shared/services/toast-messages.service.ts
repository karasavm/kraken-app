import {Injectable} from '@angular/core';
// import * from "materialize-css";
// import * from 'angular2-materialize';
// let Materialize: any;

@Injectable()
export class ToastMessagesService {


  private displayLength = 2000;
  private toastParams = []


  constructor() { }

  success(message: string) {
    this.toastParams = [message, 4000 , 'green'];

    Materialize.toast(
      message,
      this.displayLength,
      'green'
    );
  }

  error(message: string) {
    this.toastParams = [message, 4000 , 'green'];
    Materialize.toast(
      message,
      this.displayLength,
      'red'
    );
  }



}
