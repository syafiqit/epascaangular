import { Component, OnInit } from '@angular/core';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-list-fund',
  templateUrl: './list-fund.component.html'
})
export class ListFundComponent implements OnInit {

  rows = [
    {"name":"KWABBN", "date" : "1/01/2020",  "total": "235,882,775.21", "date2":"31/12/2020", "total2": "255,199,152.00", "total_overal":"491,081,927,21", "balance":"282,925,285.85"},
    {"name":"Covid-19", "date" : "1/01/2020",  "total": "235,882,775.21", "date2":"31/12/2020", "total2": "255,199,152.00", "total_overal":"491,081,927,21", "balance":"282,925,285.85"},
  ]

  report = [
    { "title": "Jumlah Keseluruhan Semasa (RM)", "total_kos": "491,081,927.21" },
    { "title": "Jumlah Bayaran Semasa (RM)", "total_kos": "312,123,121.00" },
    { "title": "Jumlah Tanggung Semasa (RM)", "total_kos": "22,323,321.00" },
  ]

  ColumnMode = ColumnMode;
  SortType = SortType;

  constructor() { }

  ngOnInit(): void {
  }

}
