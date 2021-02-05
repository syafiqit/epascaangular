import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  encapsulation: ViewEncapsulation.None
})
export class AddUserComponent implements OnInit {

  rows = [
    {"access":"Profil Mangsa"},{"access":"Bantuan Wang Ihsan"},{"access":"Bantuan Rumah"},
    {"access":"Bantuan Pinjaman"},{"access":"Bantuan Pertanian"},{"access":"Bantuan Antarabangsa"},
    {"access":"Bantuan Lain"},{"access":"Carian"},{"access":"Laporan"},
  ]

  ColumnMode = ColumnMode;
  SortType = SortType;

  constructor() { }

  ngOnInit(): void {
  }

}