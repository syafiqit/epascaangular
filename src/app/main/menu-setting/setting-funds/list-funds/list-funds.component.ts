import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { AddFundsComponent } from '../add-funds/add-funds.component';

@Component({

  selector: 'app-list-funds',
  templateUrl: './list-funds.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal]

})

export class ListFundsComponent implements OnInit {

  rows = [
    {"source":"Kerajaan Negeri", "status":"Aktif"},{"source":"Kerajaan Persekutuan", "status":"Aktif"},
    {"source":"NGO", "status":"Aktif"},{"source":"Sumbangan Antarabangsa", "status":"Aktif"},
    {"source":"Lain-lain", "status":"Aktif"}
  ]

  ColumnMode = ColumnMode;
  SortType = SortType;

  constructor(config: NgbModalConfig, private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
  }

  addFundsModal() {
    this.modalService.open(AddFundsComponent, { size: 'lg' });
  }

}
