import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { TambahNoRujukanComponent } from '../../wang-ihsan/tambah-no-rujukan/tambah-no-rujukan.component';
@Component({
	selector: 'app-tambah-edit-skb',
	templateUrl: './tambah-edit-skb.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TambahEditSkbComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

	rows = [
		{ month: 'Januari', total: '' },
		{ month: 'Februari', total: '' },
		{ month: 'Mac', total: '' },
		{ month: 'April', total: '' },
		{ month: 'Mei', total: '' },
		{ month: 'Jun', total: '' },
		{ month: 'Julai', total: '' },
		{ month: 'Ogos', total: '' },
		{ month: 'September', total: '' },
		{ month: 'Oktober', total: '' },
		{ month: 'November', total: '' },
		{ month: 'Disember', total: '' },
		{ month: 'Jumlah Belanja', total: '' }
	];

	displayMonths = 1;
	navigation = 'select';
	showWeekNumbers = false;
	outsideDays = 'visible';

	constructor(config: NgbModalConfig, private modalService: NgbModal) {
		this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {}

	getAddSKB(event?: LazyLoadEvent) {
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

	addNoReference() {
		const modalRef = this.modalService.open(TambahNoRujukanComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
	}
}
