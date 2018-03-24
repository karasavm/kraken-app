import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material";

@Component({
  selector: 'app-link-email-modal',
  templateUrl: './link-email-modal.component.html',
  styleUrls: ['./link-email-modal.component.css']
})
export class LinkEmailModalComponent implements OnInit {

  email: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {

  }

  onClickAdd() {
    
  }

}
