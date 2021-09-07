import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { TambahEditKadarComponent } from './tambah-edit-kadar/tambah-edit-kadar.component';

@Component({
	selector: 'app-kadar',
	templateUrl: './kadar.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class KadarComponent {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

	rows = [
		{
			jenis_bantuan: 'BWI',
			jumlah_kadar: '500',
			status: 'Aktif'
		},
    {
			jenis_bantuan: 'BWI',
			jumlah_kadar: '200',
			status: 'Aktif'
		},
		{
			jenis_bantuan: 'Kematian',
			jumlah_kadar: '5000',
			status: 'Aktif'
		}
	];

	constructor(config: NgbModalConfig, private modalService: NgbModal) {
		this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	getKadar(event?: LazyLoadEvent) {
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

	addKadarModal() {
		const modalRef = this.modalService.open(TambahEditKadarComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
		modalRef.result.then((response) => {
			if (response) {
				this.getKadar();
			}
		});
	}

	editKadarModal() {
		const modalRef = this.modalService.open(TambahEditKadarComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'edit';
		modalRef.result.then((response) => {
			if (response) {
				this.getKadar();
			}
		});
	}
}
