import { AfterViewInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { TambahEditPemilikProjekRumahComponent } from './tambah-edit-pemilik-projek-rumah/tambah-edit-pemilik-projek-rumah.component';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';

@Component({
	selector: 'app-pemilik-projek-rumah',
	templateUrl: './pemilik-projek-rumah.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class PemilikProjekRumahComponent implements AfterViewInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

	rows = [
		{ name: 'Kerajaan Negeri', status: 'Aktif' },
		{ name: 'Kerajaan Persekutuan', status: 'Aktif ' },
		{ name: 'NGO', status: 'Aktif' }
	];

	constructor(config: NgbModalConfig, private modalService: NgbModal) {
		config.backdrop = 'static';
		config.keyboard = false;
		this.primengTableHelper = new PrimengTableHelper();
	}

	addProjectOwnerModal() {
		const modalRef = this.modalService.open(TambahEditPemilikProjekRumahComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
	}

	editProjectOwnerModal() {
		const modalRef = this.modalService.open(TambahEditPemilikProjekRumahComponent, { size: 'lg' });
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
