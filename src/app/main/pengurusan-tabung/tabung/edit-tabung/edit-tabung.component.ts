import { AfterViewInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { TambahPeruntukanComponent } from '../edit-tabung/tambah-peruntukan/tambah-peruntukan.component';

@Component({
  selector: 'app-edit-tabung',
  templateUrl: './edit-tabung.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal]
})
export class EditTabungComponent implements AfterViewInit {
  @ViewChild('dataTable', { static: true }) dataTable: Table;
  @ViewChild('paginator', { static: true }) paginator: Paginator;
  active = 1;

  primengTableHelper: PrimengTableHelper;

  rows = [
    {
      bil: '1',
      date: '1/3/2020',
      ref_number: 'AXXXX',
      source: '-',
      name: 'Sumbangan Tabung Takaful',
      total: '100,000.00',
      notes: '-'
    }
  ];

  rows2 = [
    {
      bil: '1',
      date_modified: '1/3/2020',
      total_bal: 'RM 400,000.00',
      modified_by: 'Mohd Ramzan'
    },
    {
      bil: '2',
      date_modified: '20/2/2020',
      total_bal: 'RM 200,000.00',
      modified_by: 'Mohd Ramzan'
    }
  ];

  ColumnMode = ColumnMode;
  SortType = SortType;

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

  getApplication2(event?: LazyLoadEvent) {
    if (this.primengTableHelper.shouldResetPaging(event)) {
      this.paginator.changePage(0);
      return;
    }

    this.primengTableHelper.showLoadingIndicator();
    this.primengTableHelper.totalRecordsCount = this.rows.length;
    this.primengTableHelper.records2 = this.rows2;
    this.primengTableHelper.hideLoadingIndicator();
  }

  addFundModal() {
    const modalRef = this.modalService.open(TambahPeruntukanComponent, { size: 'lg' });
    modalRef.componentInstance.name = 'add';
  }

  reloadPage(): void {
    this.paginator.changePage(this.paginator.getPage());
  }
}
