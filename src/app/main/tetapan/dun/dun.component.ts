import { AfterViewInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { TambahEditDunComponent } from './tambah-edit-dun/tambah-edit-dun.component';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';

@Component({
	selector: 'app-dun',
	templateUrl: './dun.component.html',
	encapsulation: ViewEncapsulation.None
})
export class DunComponent implements AfterViewInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

	rows = [
		{ dun: 'Guar Sanji', parliament: 'Arau', state: 'Perlis', status: 'Aktif' },
		{ dun: 'Pauh', parliament: 'Arau', state: 'Perlis', status: 'Aktif' },
		{ dun: 'Sanglang', parliament: 'Arau', state: 'Perlis', status: 'Aktif' }
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

	addDunModal() {
		const modalRef = this.modalService.open(TambahEditDunComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
	}

	editDunModal() {
		const modalRef = this.modalService.open(TambahEditDunComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'edit';
	}
}
