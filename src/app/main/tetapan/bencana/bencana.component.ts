import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { TambahEditBencanaComponent } from './tambah-edit-bencana/tambah-edit-bencana.component';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';

@Component({
	selector: 'app-bencana',
	templateUrl: './bencana.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class BencanaComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

	rows = [
		{ date: '12/12/2020', disaster: 'Banjir', notes: 'Gelombang 1' },
		{ date: '20/12/2020', disaster: 'Covid-19', notes: 'Kluster 1 & 2' },
		{ date: '3/1/2021', disaster: 'Covid-19', notes: 'Kluster 3' }
	];

	constructor(config: NgbModalConfig, private modalService: NgbModal) {
		this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {}

	getDisaster(event?: LazyLoadEvent) {
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

	addDisasterModal() {
		const modalRef = this.modalService.open(TambahEditBencanaComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
	}

	editDisasterModal() {
		const modalRef = this.modalService.open(TambahEditBencanaComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'edit';
	}
}
