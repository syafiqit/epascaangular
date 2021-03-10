import { Component, OnInit, ViewEncapsulation, Input, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';

@Component({
  selector: 'app-tambah-no-rujukan',
  templateUrl: './tambah-no-rujukan.component.html',
  encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TambahNoRujukanComponent implements OnInit {
  @ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

  @Input() name;

	modelFooter: NgbDateStruct;
	today = this.calendar.getToday();

  rows = [
		{ reference: 'JPM.APBN(S).600-3/8/2 (1)', description: 'Kelulusan Permohonan Tambahan Bina Rumah Baru Dan Baik Pulih Rumah Bagi Mangsa Banjir Tahun 2014' },
		{ reference: 'JPM.APBN(S).600-3/8/2 (2)', description: 'Kelulusan Permohonan Tambahan Bina Rumah Baru Dan Baik Pulih Rumah Bagi Mangsa Banjir Tahun 2015' },
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
