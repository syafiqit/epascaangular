import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { TambahEditHubunganComponent } from './tambah-edit-hubungan/tambah-edit-hubungan.component';

@Component({
	selector: 'app-hubungan',
	templateUrl: './hubungan.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class HubunganComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

	rows = [
		{ relationship: 'Ayah', status: 'Aktif' },
		{ relationship: 'Mak', status: 'Aktif' },
		{ relationship: 'Pakcik', status: 'Aktif' }
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

	addRelationshipModal() {
		const modalRef = this.modalService.open(TambahEditHubunganComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
	}

	editRelationshipModal() {
		const modalRef = this.modalService.open(TambahEditHubunganComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'edit';
	}
}
