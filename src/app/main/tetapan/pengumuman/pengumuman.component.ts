import { OnInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { TambahEditPengumumanComponent } from './tambah-edit-pengumuman/tambah-edit-pengumuman.component';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';

@Component({
	selector: 'app-pengumuman',
	templateUrl: './pengumuman.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class PengumumanComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

	rows = [
		{
			announcement: 'Perhatian: Sila pastikan kata kunci anda tidak diketahui oleh orang lain.',
			name: 'Wahadi Bin Mohamed',
			date: '02-06-2019'
		},
		{
			announcement: 'Perhatian: Sila kemaskini maklumat bantuan sebelum tarikh akhir pemberian',
			name: 'Ismail Bin Yaakob',
			date: '23-08-2019'
		}
	];

	constructor(config: NgbModalConfig, private modalService: NgbModal) {
		config.backdrop = 'static';
		config.keyboard = false;
		this.primengTableHelper = new PrimengTableHelper();
	}

	ngOnInit(): void {}

	getAnnouncement(event?: LazyLoadEvent) {
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

	addAnnouncementModal() {
		const modalRef = this.modalService.open(TambahEditPengumumanComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
	}

	editAnnouncementModal() {
		const modalRef = this.modalService.open(TambahEditPengumumanComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'edit';
	}
}
