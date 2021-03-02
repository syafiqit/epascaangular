import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@node_modules/@ng-bootstrap/ng-bootstrap';
import { Table } from '@node_modules/primeng/table';
import { Paginator } from '@node_modules/primeng/paginator';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';
import { LazyLoadEvent } from '@node_modules/primeng/api';
import { TambahEditPengurusanBencanaComponent } from '@app/main/pengurusan-bencana/tambah-edit-pengurusan-bencana/tambah-edit-pengurusan-bencana.component';

@Component({
	selector: 'app-pengurusan-bencana',
	templateUrl: './pengurusan-bencana.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class PengurusanBencanaComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;
	public isCollapsed = false;

	rows = [
		{
			noRujukan: 'xxxx',
			tahun: '2020',
			tarikhKejadian: '1/1/2020 - 31/12/2020',
			namaBencana: 'Banjir'
		},
		{
			noRujukan: 'xxxx',
			tahun: '2020',
			tarikhKejadian: '1/1/2020 - 31/12/2020',
			namaBencana: 'Covid-19'
		},
		{
			noRujukan: 'xxxx',
			tahun: '2020',
			tarikhKejadian: '1/1/2020 - 31/12/2020',
			namaBencana: 'Taufan'
		},
		{
			noRujukan: 'xxxx',
			tahun: '2019',
			tarikhKejadian: '1/1/2020 - 31/12/2020',
			namaBencana: 'Tanah Runtuh'
		},
		{
			noRujukan: 'xxxx',
			tahun: '2019',
			tarikhKejadian: '1/1/2020 - 31/12/2020',
			namaBencana: 'Ribut'
		}
	];

	constructor(config: NgbModalConfig, private modalService: NgbModal) {
		this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	getBencana(event?: LazyLoadEvent) {
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

	bencanaModal() {
		this.modalService.open(TambahEditPengurusanBencanaComponent, { size: 'lg' });
	}

	ngOnInit(): void {}
}
