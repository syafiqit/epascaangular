import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { TambahEditJenisBwiComponent } from './tambah-edit-jenis-bwi/tambah-edit-jenis-bwi.component';

@Component({
	selector: 'app-jenis-bwi',
	templateUrl: './jenis-bwi.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class JenisBwiComponent {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

	rows = [
		{
			nama_jenis_bwi: 'Bencana',
			status: 'Aktif'
		},
    {
			nama_jenis_bwi: 'Lain-lain',
			status: 'Aktif'
		},
		{
			nama_jenis_bwi: 'Kematian',
			status: 'Aktif'
		}
	];

	constructor(config: NgbModalConfig, private modalService: NgbModal) {
		this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	getJenisBwi(event?: LazyLoadEvent) {
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

	addJenisBwiModal() {
		const modalRef = this.modalService.open(TambahEditJenisBwiComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
		modalRef.result.then((response) => {
			if (response) {
				this.getJenisBwi();
			}
		});
	}

	editJenisBwiModal() {
		const modalRef = this.modalService.open(TambahEditJenisBwiComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'edit';
		modalRef.result.then((response) => {
			if (response) {
				this.getJenisBwi();
			}
		});
	}
}
