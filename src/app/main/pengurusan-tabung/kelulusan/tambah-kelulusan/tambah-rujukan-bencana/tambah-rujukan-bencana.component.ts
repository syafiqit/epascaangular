import { AfterViewInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-tambah-rujukan-bencana',
	templateUrl: './tambah-rujukan-bencana.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TambahRujukanBencanaComponent implements AfterViewInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

	rows = [
		{
			refNo: 'BEN1XXXX',
			year: '2020',
			date: '20/1/2020',
			disaster: 'Banjir',
			name: 'Banjir Malaysia',
			notes: 'Kejadian Banjir Seluruh Negara'
		},
		{
			refNo: 'BEN2XXXX',
			year: '2020',
			date: '1/4/2020',
			disaster: 'Covid-19',
			name: 'Covid-19 Malaysia',
			notes: 'Kejadian Covid-19 Seluruh Negara'
		},
		{
			refNo: 'BEN2XXXX',
			year: '2019',
			date: '24/3/2019',
			disaster: 'Ribut',
			name: 'Ribut Taufan Kelantan',
			notes: 'Taufan Kelantan-Kota Bahru'
		}
	];

	constructor(config: NgbModalConfig, private modalService: NgbModal, public activeModal: NgbActiveModal) {
		this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
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
