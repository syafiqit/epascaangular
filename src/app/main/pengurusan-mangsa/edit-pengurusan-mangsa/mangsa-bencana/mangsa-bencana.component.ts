import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { TambahEditMangsaBencanaComponent } from './tambah-edit-mangsa-bencana/tambah-edit-mangsa-bencana.component';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
declare let require;
const Swal = require('sweetalert2');

@Component({
	selector: 'app-mangsa-bencana',
	templateUrl: './mangsa-bencana.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class MangsaBencanaComponent implements OnInit {
  @Input() public idMangsa: number;

	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

	rows = [
		{ year: '2020', type: 'Covid-19', status: 'Tidak Berpindah', centre: '-' },
		{ year: '2020', type: 'Covid-19', status: 'Tidak Berpindah', centre: '-' },
		{ year: '2020', type: 'Covid-19', status: 'Tidak Berpindah', centre: '-' }
	];

	categories = [{ data: 'barangan kebersihan' }, { data: 'barangan perubatan' }];

	items = [{ data: 'Makanan Tin' }, { data: 'Makanan Kering' }];

	ColumnMode = ColumnMode;
	SortType = SortType;

	delete() {
		Swal.fire('Berjaya!', 'Barangan Berjaya Di Buang.', 'success');
	}

	addVictimDisasterModal() {
		this.modalService.open(TambahEditMangsaBencanaComponent, { size: 'lg' });
	}

	constructor(config: NgbModalConfig, private modalService: NgbModal) {
		this.primengTableHelper = new PrimengTableHelper();
	}

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

	ngOnInit(): void {}
}
