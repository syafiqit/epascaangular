import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { PilihanRujukanKelulusanComponent } from '../pilihan-rujukan-kelulusan/pilihan-rujukan-kelulusan.component';
import {
  CreateOrEditTabungBayaranSkbDto,
  InputCreateBayaranSkbDto,
  InputSkbBulananDto,
  RefAgensiServiceProxy,
  TabungBayaranSkbServiceProxy
} from 'src/app/shared/proxy/service-proxies';
import { TambahBelanjaBulanan } from '../tambah-belanja-bulanan/tambah-belanja-bulanan.component';
import * as moment from 'moment';
import { Router } from '@angular/router';
declare let require;
const Swal = require('sweetalert2');
@Component({
	selector: 'app-tambah-skb',
	templateUrl: './tambah-skb.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal, NgbActiveModal]
})
export class TambahSkbComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

  bayaranSKB: InputCreateBayaranSkbDto =  new InputCreateBayaranSkbDto();
  skb: CreateOrEditTabungBayaranSkbDto = new CreateOrEditTabungBayaranSkbDto();
  bulanan: InputSkbBulananDto[] = [];

  agencies: any;
  no_rujukan_kelulusan: number;
  nama_tabung: string;
  date = new Date();
  filter: string;
  saving = false;
  tarikhMula: string;
  tarikhTamat: string;
  idBulan: number = 0;
  rows = [];

	constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private _tabungBayaranSkbServiceProxy: TabungBayaranSkbServiceProxy,
    private _refAgensiServiceProxy: RefAgensiServiceProxy,
    private router: Router
  ) {
    this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
    this.getAgensi();
    this.getAddSKB();
  }

  getAgensi(filter?) {
		this._refAgensiServiceProxy.getRefAgensiForDropdown(filter).subscribe((result) => {
			this.agencies = result.items;
		});
	}

	getAddSKB(event?: LazyLoadEvent) {
		if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this.primengTableHelper.totalRecordsCount = this.rows.length;
		this.primengTableHelper.records = this.rows;
		this.primengTableHelper.hideLoadingIndicator();
	}

  addBulanan() {
		const modalRef = this.modalService.open(TambahBelanjaBulanan, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
    modalRef.componentInstance.kategori = 1;

    modalRef.result.then(
			(response) => {
				if (response) {
          this.idBulan = this.idBulan + 1;
          this.rows.push({ id: this.idBulan, tahun: response.tahun, bulan: response.bulan, jumlah: response.jumlah });
          this.getAddSKB();
				}
			},
			() => {}
		);
	}

  editBulanan(idBulan, tahun, bulan, jumlah) {
		const modalRef = this.modalService.open(TambahBelanjaBulanan, { size: 'lg' });
		modalRef.componentInstance.name = 'edit';
    modalRef.componentInstance.kategori = 1;
		modalRef.componentInstance.idBulan = idBulan;
		modalRef.componentInstance.tahun = tahun;
		modalRef.componentInstance.bulan = bulan;
		modalRef.componentInstance.jumlah = jumlah;

    modalRef.result.then(
			(response) => {
				if (response) {
          let d = this.rows.find(e => e.id == response.id);
          d.tahun = response.tahun;
          d.bulan = response.bulan;
          d.jumlah = response.jumlah;
          this.getAddSKB();

				}
			},
			() => {}
		);
	}

  deleteBulanan(id) {
    const index = this.rows.indexOf(id);
    this.rows.splice(index, 1);
    this.getAddSKB();
	}

	reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}

	addNoReference() {
		const modalRef = this.modalService.open(PilihanRujukanKelulusanComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
    modalRef.result.then(
			(response) => {
				if (response) {
					this.no_rujukan_kelulusan = response.no_rujukan_kelulusan;
          this.nama_tabung = response.nama_tabung;
          this.skb.id_tabung_kelulusan = response.id;
				}
			},
			() => {}
		);
	}

	save() {
    this.saving = true;
    for(let i = 0; i < this.rows.length; i++){
      const monthly = new InputSkbBulananDto();
      monthly.tahun = this.rows[i].tahun;
      monthly.bulan = this.rows[i].bulan;
      monthly.jumlah = this.rows[i].jumlah;
      this.bulanan.push(monthly);
    }

    this.bayaranSKB.skb = this.skb;
    this.bayaranSKB.skb.tarikh_mula = moment(this.tarikhMula);
    this.bayaranSKB.skb.tarikh_tamat = moment(this.tarikhTamat);
    this.bayaranSKB.skb.no_rujukan_skb = null;
    this.bayaranSKB.skb.perihal = null;
    this.bayaranSKB.skbBulanan = this.bulanan;
		this._tabungBayaranSkbServiceProxy
			.createOrEdit(this.bayaranSKB)
			.pipe()
			.subscribe((result) => {
				Swal.fire('Berjaya!', 'Maklumat Surat Kuasa Belanja Berjaya Dihantar.', 'success').then(() => {
          this.router.navigateByUrl('/app/tabung/senarai-skb');
				});
			});
	}
}
