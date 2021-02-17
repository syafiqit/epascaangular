import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { TambahEditKementerianComponent } from './tambah-edit-kementerian/tambah-edit-kementerian.component';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';

@Component({
	selector: 'app-kementerian',
	templateUrl: './kementerian.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class KementerianComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

	rows = [
		{ name: 'Jabatan Perdana Menteri', code: 'JPM', status: 'Aktif' },
		{ name: 'Kementerian Dalam Negeri', code: 'KDN', status: 'Aktif' },
		{ name: 'Kementerian Kerja Raya', code: 'KKR', status: 'Aktif' }
	];

	constructor(config: NgbModalConfig, private modalService: NgbModal) {
		this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {}

	getMinistry(event?: LazyLoadEvent) {
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

	addMinistryModal() {
		const modalRef = this.modalService.open(TambahEditKementerianComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
	}

	editMinistryModal() {
		const modalRef = this.modalService.open(TambahEditKementerianComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'edit';
	}
}
