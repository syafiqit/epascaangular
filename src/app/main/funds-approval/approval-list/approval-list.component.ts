import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

@Component({

  selector: 'app-approval-list',
  templateUrl: './approval-list.component.html',
  encapsulation: ViewEncapsulation.None,

})

export class ApprovalListComponent implements OnInit {

  public isCollapsed = false;
  modelFooter: NgbDateStruct;
  today = this.calendar.getToday();
  displayMonths = 1;
  navigation = 'select';
  showWeekNumbers = false;
  outsideDays = 'visible';

  rows = [
    {"refNo":"AXXXXX", "funds":"KWABBN", "category":"Banjir", "letterDate":"17/12/2019", 
        "letterRef":"JPM.APBN(S).600-3/8/2 Jld.7 (7)", "startDate":"30/12/2019", 
        "lastDate":"31/12/2020", "total":"304,996.00", "balance":"695,004.00", "status":"Aktif"},
    {"refNo":"BXXXXX", "funds":"Covid", "category":"Covid-19", "letterDate":"17/12/2019", 
        "letterRef":"JPM.APBN(S).600-3/8/2 Jld.7 (7)", "startDate":"30/12/2019", 
        "lastDate":"31/12/2020", "total":"304,996.00", "balance":"695,004.00", "status":"Aktif"}
  ]

  ColumnMode = ColumnMode;
  SortType = SortType;

  constructor(private calendar: NgbCalendar) {
    
  }

  ngOnInit(): void {
  }


}
