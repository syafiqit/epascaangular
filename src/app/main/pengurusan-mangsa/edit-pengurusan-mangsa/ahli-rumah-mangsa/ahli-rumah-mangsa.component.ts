import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { TambahEditAhliRumahMangsaComponent } from './tambah-edit-ahli-rumah-mangsa/tambah-edit-ahli-rumah-mangsa.component';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { LazyLoadEvent } from 'primeng/api';
declare let require;
const Swal = require('sweetalert2');

@Component({
	selector: 'app-ahli-rumah-mangsa',
	templateUrl: './ahli-rumah-mangsa.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class AhliRumahMangsaComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

	public isCollapsed = false;

	rows = [{ kp: 'xxxx-xx-xxxx', name: 'Azizah Bt Kasim', age: '12', relationship: 'Anak Perempuan' }];

	categories = [{ data: 'barangan kebersihan' }, { data: 'barangan perubatan' }];

	items = [{ data: 'Makanan Tin' }, { data: 'Makanan Kering' }];

	ColumnMode = ColumnMode;
	SortType = SortType;

	delete() {
		Swal.fire('Berjaya!', 'Barangan Berjaya Di Buang.', 'success');
	}

	addHouseholdModal() {
		this.modalService.open(TambahEditAhliRumahMangsaComponent, { size: 'lg' });
	}

	constructor(config: NgbModalConfig, private modalService: NgbModal) {
		this.primengTableHelper = new PrimengTableHelper();
	}

	getHousehold(event?: LazyLoadEvent) {
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
