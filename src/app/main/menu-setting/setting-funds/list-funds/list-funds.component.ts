import { AfterViewInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { AddFundsComponent } from '../add-funds/add-funds.component';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';

@Component({
	selector: 'app-list-funds',
	templateUrl: './list-funds.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class ListFundsComponent implements AfterViewInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

	rows = [
		{ source: 'Kerajaan Negeri', status: 'Aktif' },
		{ source: 'Kerajaan Persekutuan', status: 'Aktif' },
		{ source: 'NGO', status: 'Aktif' },
		{ source: 'Sumbangan Antarabangsa', status: 'Aktif' },
		{ source: 'Lain-lain', status: 'Aktif' }
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

	addFundsModal() {
		const modalRef = this.modalService.open(AddFundsComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
	}

	editFundsModal() {
		const modalRef = this.modalService.open(AddFundsComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'edit';
	}
}
