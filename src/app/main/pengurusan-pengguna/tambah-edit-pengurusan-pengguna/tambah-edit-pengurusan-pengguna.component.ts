import { AfterViewInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';

@Component({
	selector: 'app-tambah-edit-pengurusan-pengguna',
	templateUrl: './tambah-edit-pengurusan-pengguna.component.html',
	encapsulation: ViewEncapsulation.None
})
export class TambahEditPengurusanPenggunaComponent implements AfterViewInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

	rows = [
		{ category: 'Profil Mangsa' },
		{ category: 'Bantuan Wang Ehsan' },
		{ category: 'Bantuan Rumah' },
		{ category: 'Bantuan Pinjaman' },
		{ category: 'Bantuan Pertanian' },
		{ category: 'Bantuan Antarabangsa' },
		{ category: 'Bantuan Lain' },
		{ category: 'Carian' },
		{ category: 'Laporan' }
	];

	ColumnMode = ColumnMode;
	SortType = SortType;

	constructor() {
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
}
