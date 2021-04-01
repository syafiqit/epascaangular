import { AfterViewInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { TambahEditStatusBerpindahComponent } from './tambah-edit-status-berpindah/tambah-edit-status-berpindah.component';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import {RefPindahServiceProxy} from "../../../shared/proxy/service-proxies";

@Component({
	selector: 'app-status-berpindah',
	templateUrl: './status-berpindah.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class StatusBerpindahComponent implements AfterViewInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

  filterText = '';

	constructor(
	  config: NgbModalConfig,
    private modalService: NgbModal,
    private _refPindahServiceProxy: RefPindahServiceProxy
  ) {
		config.backdrop = 'static';
		config.keyboard = false;
		this.primengTableHelper = new PrimengTableHelper();
	}

	ngAfterViewInit(): void {
		//this.primengTableHelper.adjustScroll(this.dataTable);
	}

	getPindah(event?: LazyLoadEvent) {
    if (this.primengTableHelper.shouldResetPaging(event)) {
      this.paginator.changePage(0);
      return;
    }

    this.primengTableHelper.showLoadingIndicator();
    this._refPindahServiceProxy
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

	addEvacuateModal() {
		const modalRef = this.modalService.open(TambahEditStatusBerpindahComponent, { size: 'lg' });
    modalRef.componentInstance.name = 'add';
    modalRef.result.then((response) => {
      if (response) {
        this.getPindah();
      }
    });
	}

	editEvacuateModal(id) {
		const modalRef = this.modalService.open(TambahEditStatusBerpindahComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'edit';
    modalRef.componentInstance.id = id;
    modalRef.result.then((response) => {
      if (response) {
        this.getPindah();
      }
    });
	}
}
