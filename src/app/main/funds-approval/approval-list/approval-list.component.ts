import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
@Component({
  selector: 'app-approval-list',
  templateUrl: './approval-list.component.html',
  encapsulation: ViewEncapsulation.None,
})

export class ApprovalListComponent implements OnInit {

  @ViewChild('dataTable', { static: true }) dataTable: Table;
  @ViewChild('paginator', { static: true }) paginator: Paginator;

  primengTableHelper: PrimengTableHelper;

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

  constructor(private calendar: NgbCalendar) {
    this.primengTableHelper = new PrimengTableHelper();

  }

  getApproval(event?: LazyLoadEvent) {
    if (this.primengTableHelper.shouldResetPaging(event)) {
      this.paginator.changePage(0);
      return;
    }

    this.primengTableHelper.showLoadingIndicator();
    this.primengTableHelper.totalRecordsCount = this.rows.length;
    this.primengTableHelper.records = this.rows;
    this.primengTableHelper.hideLoadingIndicator();
  }

  reloadPage(): void {
    this.paginator.changePage(this.paginator.getPage());
  }

  ngOnInit(): void {
  }


}
