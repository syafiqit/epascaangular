import { AfterViewInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { TambahEditPinjamanUsahawanComponent } from './tambah-edit-pinjaman-usahawan/tambah-edit-pinjaman-usahawan.component';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import {RefPinjamanPerniagaanServiceProxy} from "../../../shared/proxy/service-proxies";

@Component({
	selector: 'app-pinjaman-usahawan',
	templateUrl: './pinjaman-usahawan.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class PinjamanUsahawanComponent implements AfterViewInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

  filterText = '';

	constructor(
	  config: NgbModalConfig,
    private modalService: NgbModal,
    private _refPinjamanPerniagaanServiceProxy: RefPinjamanPerniagaanServiceProxy,
  ) {
		config.backdrop = 'static';
		config.keyboard = false;
		this.primengTableHelper = new PrimengTableHelper();
	}

	addEntrepreneurModal() {
		const modalRef = this.modalService.open(TambahEditPinjamanUsahawanComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
    modalRef.result.then((response) => {
      if (response) {
        this.getPinjaman();
      }
    });
	}

	editEntrepreneurModal(id) {
		const modalRef = this.modalService.open(TambahEditPinjamanUsahawanComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'edit';
    modalRef.componentInstance.id = id;
    modalRef.result.then((response) => {
      if (response) {
        this.getPinjaman();
      }
    });
	}

	ngAfterViewInit(): void {
		//this.primengTableHelper.adjustScroll(this.dataTable);
	}

	getPinjaman(event?: LazyLoadEvent) {
    if (this.primengTableHelper.shouldResetPaging(event)) {
      this.paginator.changePage(0);
      return;
    }

    this.primengTableHelper.showLoadingIndicator();
    this._refPinjamanPerniagaanServiceProxy
      .getAll(
        this.filterText,
        this.primengTableHelper.getSorting(this.dataTable),
        this.primengTableHelper.getSkipCount(this.paginator, event),
        this.primengTableHelper.getMaxResultCount(this.paginator, event)
      )
      .subscribe((result) => {
        this.primengTableHelper.totalRecordsCount = result.total_count;
        this.primengTableHelper.records = result.items;
        this.primengTableHelper.hideLoadingIndicator();
      });
	}

	reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}
}
