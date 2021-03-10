import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { TambahEditRujukanComponent } from './tambah-edit-rujukan/tambah-edit-rujukan.component';

@Component({
  selector: 'app-rujukan',
  templateUrl: './rujukan.component.html',
  encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class RujukanComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

	rows = [
		{ name: 'Manual Penggunaan Sistem', fail: 'Sistem.pdf'},
    { name: 'Manual Pengurusan Tabung', fail: 'Sistem_Tabung.pdf'},
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

	addReferenceModal() {
		const modalRef = this.modalService.open(TambahEditRujukanComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
	}

	editReferenceModal() {
		const modalRef = this.modalService.open(TambahEditRujukanComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'edit';
	}
}
