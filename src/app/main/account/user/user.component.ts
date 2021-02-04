import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {

  detail = {
    "name" : "Jamal Halim",
    "email" : "do_1@gmail.com",
    "no_tel1" : "013-223890",
    "no_tel2" : "03-8902274"
  }

  account = {
    "organization_name" : "Ngo Ebit",
    "chairman_name" : "Halim Hamzah",
    "officer" : "Ramzan Ali",
    "email" : "yayasanHalimEbit@gmail.com",
    "web" : "http://www.yayasanhalimebit.com",
    "no_registration" : "T-26718",
    "year" : "2016",
    "tel_1" : "010-4339294",
    "tel_2" : "013-2232590"
  }

  constructor() { }

  ngOnInit(): void {
  }

}
