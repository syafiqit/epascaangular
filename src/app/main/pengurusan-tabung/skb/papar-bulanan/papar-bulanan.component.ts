import { Component, OnInit, ViewEncapsulation, Input, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbCalendar, NgbDateStruct, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { TambahBelanjaBulanan } from '../tambah-belanja-bulanan/tambah-belanja-bulanan.component';

@Component({
	selector: 'app-papar-bulanan',
	templateUrl: './papar-bulanan.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class PaparBulananComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

  tarikh_mula: string = "06-03-2020";
  tarikh_tamat: string = "12-01-2021";
  status_skb_bulanan: any;

  date = new Date();
  modelMula: NgbDateStruct;
  modelTamat: NgbDateStruct;
  today = this.calendar.getToday();

  statuses = [
    { id: 1, nama: "Aktif" },
    { id: 2, nama: "Lanjut" },
    { id: 3, nama: "Tamat Tempoh" },
    { id: 4, nama: "Selesai" }
  ]

  rows = [
    { tahun: "2020", bulan: "JANUARI", jumlah: "500" },
    { tahun: "2020", bulan: "FEBRUARI", jumlah: "500" },
    { tahun: "2020", bulan: "APRIL", jumlah: "500" },
    { tahun: "2020", bulan: "JULAI", jumlah: "500" }
  ]

	constructor(
    config: NgbModalConfig,
    private calendar: NgbCalendar,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal
  ) {
		this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {}

	getBulananSKB(event?: LazyLoadEvent) {
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

  addBulanan() {
		const modalRef = this.modalService.open(TambahBelanjaBulanan, { size: 'md' });
		modalRef.componentInstance.name = 'add';
  }

  editBulanan() {
		const modalRef = this.modalService.open(TambahBelanjaBulanan, { size: 'md' });
		modalRef.componentInstance.name = 'edit';
  }
}
