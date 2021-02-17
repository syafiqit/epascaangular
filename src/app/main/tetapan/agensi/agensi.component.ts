import { AfterViewInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { TambahEditAgensiComponent } from './tambah-edit-agensi/tambah-edit-agensi.component';

@Component({
	selector: 'app-agensi',
	templateUrl: './agensi.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class AgensiComponent implements AfterViewInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

	rows = [
		{ name: 'Agensi Pengurusan Bencana Negara', code: 'APBN', ministry: 'JPN', status: 'Aktif' },
		{ name: 'Amanah Ikhtiar Malaysia', code: 'AIM', ministry: 'LAIN', status: 'Aktif ' },
		{ name: 'Felcra Berhad', code: 'FELCRA', ministry: 'KKLW', status: 'Aktif' }
	];

	constructor(config: NgbModalConfig, private modalService: NgbModal) {
		this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
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

	addAgencyModal() {
		this.modalService.open(TambahEditAgensiComponent, { size: 'lg' });
	}

	editAgencyModal() {
		this.modalService.open(TambahEditAgensiComponent, { size: 'lg' });
	}
}
