import { AfterViewInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { AddExecutorComponent } from '../executor/add-executor/add-executor.component';
import { EditExecutorComponent } from '../executor/edit-executor/edit-executor.component';

@Component({
  selector: 'app-executor',
  templateUrl: './executor.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal]
})
export class ExecutorComponent implements AfterViewInit {

  @ViewChild('dataTable', { static: true }) dataTable: Table;
  @ViewChild('paginator', { static: true }) paginator: Paginator;

  primengTableHelper: PrimengTableHelper;

  rows = [
    { "name": "APBM (NADMA)", "status": "Aktif",},
    { "name": "CIDB", "status": "Aktif ",},
    { "name": "GIATMARA", "status": "Aktif",},
  ];

  constructor(config: NgbModalConfig, private modalService: NgbModal) {
    this.primengTableHelper = new PrimengTableHelper();
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngAfterViewInit(): void {
    //this.primengTableHelper.adjustScroll(this.dataTable);
  }

  getApplication(event?: LazyLoadEvent) {
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

  addExecutorModal() {
    this.modalService.open(AddExecutorComponent, { size: 'lg' });
  }

  editExecutorModal() {
    this.modalService.open(EditExecutorComponent, { size: 'lg' });
  }

}
