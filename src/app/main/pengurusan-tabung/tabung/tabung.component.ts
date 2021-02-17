import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { TambahEditTabungComponent } from './tambah-edit-tabung/tambah-edit-tabung.component';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';

@Component({
	selector: 'app-tabung',
	templateUrl: './tabung.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TabungComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

	rows = [
		{
			name: 'KWABBN',
			date: '1/01/2020',
			total: '235,882,775.21',
			date2: '31/12/2020',
			total2: '255,199,152.00',
			total_overal: '491,081,927,21',
			balance: '282,925,285.85'
		},
		{
			name: 'Covid-19',
			date: '1/01/2020',
			total: '235,882,775.21',
			date2: '31/12/2020',
			total2: '255,199,152.00',
			total_overal: '491,081,927,21',
			balance: '282,925,285.85'
		}
	];

	report = [
		{ title: 'Jumlah Keseluruhan Semasa (RM)', total_kos: '491,081,927.21' },
		{ title: 'Jumlah Bayaran Semasa (RM)', total_kos: '312,123,121.00' },
		{ title: 'Jumlah Tanggung Semasa (RM)', total_kos: '22,323,321.00' }
	];

	constructor(config: NgbModalConfig, private modalService: NgbModal) {
		this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {}

	getFund(event?: LazyLoadEvent) {
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

	addFundModal() {
		const modalRef = this.modalService.open(TambahEditTabungComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
	}

	editFundModal() {
		const modalRef = this.modalService.open(TambahEditTabungComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'edit';
	}
}
