import { Component, OnInit, ViewEncapsulation, Input, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';

@Component({
	selector: 'app-tambah-ketua-isi-rumah',
	templateUrl: './tambah-ketua-isi-rumah.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TambahKetuaIsiRumahComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

	@Input() name;

	modelFooter: NgbDateStruct;
	today = this.calendar.getToday();

	rows = [
		{ name: 'Abu Bin Ali', totalAir: '5', total: '500', state: 'Johor', area: 'Segamat' },
		{ name: 'Ramzan Bin Arifin', totalAir: '5', total: '500', state: 'Johor', area: 'Segamat' }
	];

	constructor(private modalService: NgbModal, public activeModal: NgbActiveModal, private calendar: NgbCalendar) {
		this.primengTableHelper = new PrimengTableHelper();
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
}
