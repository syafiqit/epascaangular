import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
@Component({
  selector: 'app-skb',
  templateUrl: './skb.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal]
})
export class SKBComponent implements OnInit {

  @ViewChild('dataTable', { static: true }) dataTable: Table;
  @ViewChild('paginator', { static: true }) paginator: Paginator;

  primengTableHelper: PrimengTableHelper;

  rows = [
    { "approvalRef": "AXXXXX", "skbRef": "SKBXXX", "officer": "Setiausaha Kerajaan", "agency": "SUK Negeri Kedah", "fundCategory": "Bukan Covid", "startDate": "23/10/2019", "endDate": "30/6/2020", "ceilingAllocate": "510000.00", "balAllocate": "510000.00", "totalExp": "-", "status": "Tamat Tempoh"},
    { "approvalRef": "AXXXXX", "skbRef": "SKBXXX", "officer": "Setiausaha Kerajaan", "agency": "APM Negeri Johor ", "fundCategory": "Bukan Covid", "startDate": "25/10/2019", "endDate": "31/3/2020", "ceilingAllocate": "20000.00", "balAllocate": "15000.00", "totalExp": "5000", "status": "Lanjut"},
  ];

  constructor(config: NgbModalConfig, private modalService: NgbModal) {
    this.primengTableHelper = new PrimengTableHelper();
    config.backdrop = 'static';
    config.keyboard = false;
  }

  getSKB(event?: LazyLoadEvent) {
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
