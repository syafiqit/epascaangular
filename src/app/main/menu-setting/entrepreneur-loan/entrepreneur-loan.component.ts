import { AfterViewInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { AddEntrepreneurLoanComponent } from '../entrepreneur-loan/add-entrepreneur-loan/add-entrepreneur-loan.component';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';

@Component({
  selector: 'app-entrepreneur-loan',
  templateUrl: './entrepreneur-loan.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal]
})
export class EntrepreneurLoanComponent implements AfterViewInit {
  @ViewChild('dataTable', { static: true }) dataTable: Table;
  @ViewChild('paginator', { static: true }) paginator: Paginator;

  primengTableHelper: PrimengTableHelper;

  rows = [
    { "name": "Pembuatan", "status": "Aktif",},
    { "name": "Perkhidmatan", "status": "Aktif ",},
    { "name": "Pertanian dan Perusahaan Asas Tani", "status": "Aktif",},
    { "name": "Peruncitan", "status": "Aktif",},
  ];

  constructor(config: NgbModalConfig, private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;
    this.primengTableHelper = new PrimengTableHelper();
  }

  addEntrepreneurModal() {
    const modalRef = this.modalService.open(AddEntrepreneurLoanComponent , { size: 'lg' });
    modalRef.componentInstance.name = 'add';
  }

  editEntrepreneurModal() {
    const modalRef = this.modalService.open(AddEntrepreneurLoanComponent , { size: 'lg' });
    modalRef.componentInstance.name = 'edit';
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

}
