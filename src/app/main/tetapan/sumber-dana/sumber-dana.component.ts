import { AfterViewInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { TambahEditSumberDanaComponent } from './tambah-edit-sumber-dana/tambah-edit-sumber-dana.component';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import {RefSumberDanaServiceProxy} from "../../../shared/proxy/service-proxies";

@Component({
	selector: 'app-sumber-dana',
	templateUrl: './sumber-dana.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class SumberDanaComponent implements AfterViewInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

  filterText = '';

	constructor(
	  config: NgbModalConfig,
    private modalService: NgbModal,
    private _refSumberDanaServiceProxy: RefSumberDanaServiceProxy
  ) {
		config.backdrop = 'static';
		config.keyboard = false;
		this.primengTableHelper = new PrimengTableHelper();
	}

	ngAfterViewInit(): void {
		//this.primengTableHelper.adjustScroll(this.dataTable);
	}

	getSumberDana(event?: LazyLoadEvent) {
    if (this.primengTableHelper.shouldResetPaging(event)) {
      this.paginator.changePage(0);
      return;
    }

    this.primengTableHelper.showLoadingIndicator();
    this._refSumberDanaServiceProxy
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

	addFundsModal() {
		const modalRef = this.modalService.open(TambahEditSumberDanaComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
    modalRef.result.then((response) => {
      if (response) {
        this.getSumberDana();
      }
    });
	}

	editFundsModal(id) {
		const modalRef = this.modalService.open(TambahEditSumberDanaComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'edit';
    modalRef.componentInstance.id = id;
    modalRef.result.then((response) => {
      if (response) {
        this.getSumberDana();
      }
    });
	}
}
