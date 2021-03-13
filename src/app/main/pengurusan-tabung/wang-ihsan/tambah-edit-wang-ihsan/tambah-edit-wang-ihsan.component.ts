import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { TambahKetuaIsiRumahComponent } from '../tambah-ketua-isi-rumah/tambah-ketua-isi-rumah.component';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { TambahNoRujukanComponent } from '../tambah-no-rujukan/tambah-no-rujukan.component';

@Component({
	selector: 'app-tambah-edit-wang-ihsan',
	templateUrl: './tambah-edit-wang-ihsan.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TambahEditWangIhsanComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

	rows = [
		{ name: 'Abu Bin Ali', total: '500', state: 'Johor', area: 'Segamat' },
		{ name: 'Ramzan Bin Arifin', total: '500', state: 'Johor', area: 'Segamat' }
	];

	state = [
		{ state: 'Johor' },
		{ state: 'Kedah' },
		{ state: 'Kelantan' },
		{ state: 'Melaka' },
		{ state: 'Negeri Sembilan' },
		{ state: 'Pahang' },
		{ state: 'Perak' },
		{ state: 'Perlis' },
		{ state: 'Pulau Pinang' },
		{ state: 'Sabah' },
		{ state: 'Sarawak' },
		{ state: 'Selangor' },
		{ state: 'Terengganu' },
		{ state: 'Wilayah Persekutuan K.L' }
	];
	area = [
		{ area: 'Segamat' },
		{ area: 'Labis' },
		{ area: 'Larkin' },
		{ area: 'Kluang' },
		{ area: 'Mersing' },
		{ area: 'Muar' },
		{ area: 'Ledang' }
	];
	disaster = [{ disaster: 'Banjir' }, { disaster: 'Gempa Bumi' }, { disaster: 'Covid-19' }];
	active = 1;

	constructor(config: NgbModalConfig, private modalService: NgbModal) {
		this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
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

	addDisasterModal() {
		const modalRef = this.modalService.open(TambahKetuaIsiRumahComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
	}

	addNoReference() {
		const modalRef = this.modalService.open(TambahNoRujukanComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
	}

	ngOnInit(): void {}
}
