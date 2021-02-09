import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';
import { AddEditFundComponent } from '../add-edit-fund/add-edit-fund.component';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-list-fund',
  templateUrl: './list-fund.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal]
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

  constructor(config: NgbModalConfig, private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
  }

  addFundModal() {
    const modalRef = this.modalService.open(AddEditFundComponent , { size: 'lg' });
    modalRef.componentInstance.name = 'add';
  }

  editFundModal() {
    const modalRef = this.modalService.open(AddEditFundComponent , { size: 'lg' });
    modalRef.componentInstance.name = 'edit';
  }

}
