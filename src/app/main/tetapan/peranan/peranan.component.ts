import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { TambahEditPerananComponent } from './tambah-edit-peranan/tambah-edit-peranan.component';

@Component({
  selector: 'app-peranan',
  templateUrl: './peranan.component.html',
  encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class PerananComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

	rows = [
		{ role: 'Pengguna Biasa', status: 'Aktif'},
		{ role: 'Penyelia', status: 'Aktif' },
		{ role: 'Admin Sekretariat', status: 'Aktif' },
    { role: 'Kewangan', status: 'Aktif' },
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

	addRoleModal() {
		const modalRef = this.modalService.open(TambahEditPerananComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
	}

	editRoleModal() {
		const modalRef = this.modalService.open(TambahEditPerananComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'edit';
	}
}
