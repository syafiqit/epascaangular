import { AfterViewInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { TambahEditStatusBerpindahComponent } from './tambah-edit-status-berpindah/tambah-edit-status-berpindah.component';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';

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

	rows = [
		{ info: 'Pusat Pemindahan', status: 'Aktif' },
		{ info: 'Berpindah ke Hotel', status: 'Aktif' },
		{ info: 'Berpindah ke Rumah Saudara', status: 'Aktif' },
		{ info: 'Tidak Berpindah', status: 'Aktif' },
		{ info: 'Lain-lain', status: 'Aktif' }
	];

	constructor(config: NgbModalConfig, private modalService: NgbModal) {
		config.backdrop = 'static';
		config.keyboard = false;
		this.primengTableHelper = new PrimengTableHelper();
	}

	ngAfterViewInit(): void {
		//this.primengTableHelper.adjustScroll(this.dataTable);
	}

	getApplication(event?: LazyLoadEvent) {
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

	addEvacuateModal() {
		const modalRef = this.modalService.open(TambahEditStatusBerpindahComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
	}

	editEvacuateModal() {
		const modalRef = this.modalService.open(TambahEditStatusBerpindahComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'edit';
	}
}
