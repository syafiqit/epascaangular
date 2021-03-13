import { AfterViewInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { TambahEditJenisBantuanComponent } from './tambah-edit-jenis-bantuan/tambah-edit-jenis-bantuan.component';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';

@Component({
	selector: 'app-jenis-bantuan',
	templateUrl: './jenis-bantuan.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class JenisBantuanComponent implements AfterViewInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

	rows = [
		{ name: 'Baik Pulih Rumah', status: 'Aktif' },
		{ name: 'Bina Rumah Kekal', status: 'Aktif ' },
		{ name: 'Bina Rumah Transit', status: 'Aktif' },
		{ name: 'Pinjaman Usahawan', status: 'Aktif' },
		{ name: 'Wang Ehsan', status: 'Aktif' }
	];

	constructor(config: NgbModalConfig, private modalService: NgbModal) {
		config.backdrop = 'static';
		config.keyboard = false;
		this.primengTableHelper = new PrimengTableHelper();
	}

	addHelpDonationModal() {
		const modalRef = this.modalService.open(TambahEditJenisBantuanComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
	}

	editHelpDonationModal() {
		const modalRef = this.modalService.open(TambahEditJenisBantuanComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'edit';
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
}