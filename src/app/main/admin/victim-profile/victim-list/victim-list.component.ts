import { Component, OnInit, ViewChild } from '@angular/core';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { PrimengTableHelper } from '../../../../shared/helpers/PrimengTableHelper';
import { LazyLoadEvent } from 'primeng/api';
declare let require;
const Swal = require('sweetalert2');

@Component({
	selector: 'app-victim-list',
	templateUrl: './victim-list.component.html'
})
export class VictimListComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

	public isCollapsed = false;

	localization = {
		emptyMessage: 'Tiada Data',
		totalMessage: 'Jumlah'
	};

	rows = [
		{
			kp: '999999-11-2222',
			nameKir: 'Asmah Binti Haji Ameran',
			waterBill: '1',
			total: '500',
			state: 'Sarawak',
			source: 'JPAM',
			verification: 'Sudah'
		},
		{
			kp: '999999-11-2222',
			nameKir: 'Asmah Binti Haji Ameran',
			waterBill: '1',
			total: '500',
			state: 'Sarawak',
			source: 'JPAM',
			verification: 'Sudah'
		},
		{
			kp: '999999-11-2222',
			nameKir: 'Asmah Binti Haji Ameran',
			waterBill: '1',
			total: '500',
			state: 'Sarawak',
			source: 'JPAM',
			verification: 'Sudah'
		},
		{
			kp: '999999-11-2222',
			nameKir: 'Asmah Binti Haji Ameran',
			waterBill: '1',
			total: '500',
			state: 'Sarawak',
			source: 'JPAM',
			verification: 'Sudah'
		},
		{
			kp: '999999-11-2222',
			nameKir: 'Asmah Binti Haji Ameran',
			waterBill: '1',
			total: '500',
			state: 'Sarawak',
			source: 'JPAM',
			verification: 'Sudah'
		},
		{
			kp: '999999-11-2222',
			nameKir: 'Asmah Binti Haji Ameran',
			waterBill: '1',
			total: '500',
			state: 'Sarawak',
			source: 'JPAM',
			verification: 'Sudah'
		},
		{
			kp: '999999-11-2222',
			nameKir: 'Asmah Binti Haji Ameran',
			waterBill: '1',
			total: '500',
			state: 'Sarawak',
			source: 'JPAM',
			verification: 'Sudah'
		},
		{
			kp: '999999-11-2222',
			nameKir: 'Asmah Binti Haji Ameran',
			waterBill: '1',
			total: '500',
			state: 'Sarawak',
			source: 'JPAM',
			verification: 'Sudah'
		},
		{
			kp: '999999-11-2222',
			nameKir: 'Asmah Binti Haji Ameran',
			waterBill: '1',
			total: '500',
			state: 'Sarawak',
			source: 'JPAM',
			verification: 'Sudah'
		},
		{
			kp: '999999-11-2222',
			nameKir: 'Asmah Binti Haji Ameran',
			waterBill: '1',
			total: '500',
			state: 'Sarawak',
			source: 'JPAM',
			verification: 'Sudah'
		},
		{
			kp: '999999-11-2222',
			nameKir: 'Asmah Binti Haji Ameran',
			waterBill: '1',
			total: '500',
			state: 'Sarawak',
			source: 'JPAM',
			verification: 'Sudah'
		},
		{
			kp: '999999-11-2222',
			nameKir: 'Asmah Binti Haji Ameran',
			waterBill: '1',
			total: '500',
			state: 'Sarawak',
			source: 'JPAM',
			verification: 'Sudah'
		}
	];

	categories = [{ data: 'barangan kebersihan' }, { data: 'barangan perubatan' }];

	items = [{ data: 'Nama' }, { data: 'No KP' }];

	ColumnMode = ColumnMode;
	SortType = SortType;

	delete() {
		Swal.fire('Berjaya!', 'Barangan Berjaya Di Buang.', 'success');
	}

	constructor() {
		this.primengTableHelper = new PrimengTableHelper();
	}

	ngOnInit(): void {}

	getVictim(event?: LazyLoadEvent) {
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
