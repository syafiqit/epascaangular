import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';
import { AddExecutorComponent } from '../executor/add-executor/add-executor.component';
import { EditExecutorComponent } from '../executor/edit-executor/edit-executor.component';

@Component({
  selector: 'app-executor',
  templateUrl: './executor.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal]
})
export class ExecutorComponent implements OnInit {

  rows = [
    { "name": "APBM (NADMA)", "status": "Aktif",},
    { "name": "CIDB", "status": "Aktif ",},
    { "name": "GIATMARA", "status": "Aktif",},
  ];

  ColumnMode = ColumnMode;
  SortType = SortType;
  page = 4;

  constructor(config: NgbModalConfig, private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  addExecutorModal() {
    this.modalService.open(AddExecutorComponent, { size: 'lg' });
  }

  editExecutorModal() {
    this.modalService.open(EditExecutorComponent, { size: 'lg' });
  }

  ngOnInit(): void {
  }

}
