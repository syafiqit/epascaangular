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
    "name" : "Halim Bin Hamzah",
    "No_kp" : "940306106025",
    "position" : "Pegawai Maklumat",
    "ministry" : "Jabatan Perdana Menteri",
    "agency" : "Nadma",
    "fax" : "03-64339395",
    "tel_1" : "03-64339294",
    "tel_2" : "013-2232590",
    "email" : "Halim@jpm.edu.my"
  }

  constructor() { }

  ngOnInit(): void {
  }

}
