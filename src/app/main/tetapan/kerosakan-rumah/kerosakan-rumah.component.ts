import { AfterViewInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { TambahEditKerosakanRumahComponent } from './tambah-edit-kerosakan-rumah/tambah-edit-kerosakan-rumah.component';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';

@Component({
	selector: 'app-kerosakan-rumah',
	templateUrl: './kerosakan-rumah.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class KerosakanRumahComponent implements AfterViewInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

	rows = [
		{ damage: 'Atap', status: 'Aktif' },
		{ damage: 'Dinding', status: 'Aktif' },
		{ damage: 'Lantai', status: 'Aktif' },
		{ damage: 'Pendawaian', status: 'Aktif' },
		{ damage: 'Lain-lain', status: 'Aktif' },
		{ damage: 'Pintu', status: 'Aktif' }
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

	addDamageModal() {
		const modalRef = this.modalService.open(TambahEditKerosakanRumahComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
	}

	editDamageModal() {
		const modalRef = this.modalService.open(TambahEditKerosakanRumahComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'edit';
	}
}
