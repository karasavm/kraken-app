import { Component, OnInit } from '@angular/core';
import {HeaderService} from '../header/header.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  constructor(
    private headerService: HeaderService
  ) { }

  ngOnInit() {

  }

}
