import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { NgbActiveModal, NgbCalendar, NgbDateStruct, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { PilihanRujukanKelulusanComponent } from '../pilihan-rujukan-kelulusan/pilihan-rujukan-kelulusan.component';
import {
  CreateOrEditTabungBayaranSkbDto,
  InputCreateBayaranSkbDto,
  InputSkbBulananDto,
  OutputCreateBayaranSkbDto,
  RefAgensiServiceProxy,
  TabungBayaranSkbServiceProxy
} from 'src/app/shared/proxy/service-proxies';
import { TambahBelanjaBulanan } from '../tambah-belanja-bulanan/tambah-belanja-bulanan.component';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { PilihanTabungComponent } from '../pilihan-tabung/pilihan-tabung.component';
import { PilihanBencanaComponent } from '../pilihan-bencana/pilihan-bencana.component';
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
  output: OutputCreateBayaranSkbDto = new OutputCreateBayaranSkbDto();
  bulanan: InputSkbBulananDto[] = [];

  agencies: any;
  no_rujukan_kelulusan: number;
  nama_tabung: string;
  nama_bencana: string;
  filter: string;
  saving = false;
  tarikhMula: string;
  tarikhTamat: string;
  idBulan: number = 0;
  rows = [];
  belanja: number = 0;
  balance_peruntukan: number = 0;
  id_jenis_bencana: number;

  date = new Date();
  modelMula: NgbDateStruct;
  modelTamat: NgbDateStruct;
  today = this.calendar.getToday();
  readonly DELIMITER = '-';

  categories = [
    { id: 1, nama_jenis_bencana: "Covid" },
    { id: 2, nama_jenis_bencana: "Bukan Covid" },
    { id: 3, nama_jenis_bencana: "KWABBN" },
    { id: 4, nama_jenis_bencana: "Pelbagai" }
  ]

	constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private _tabungBayaranSkbServiceProxy: TabungBayaranSkbServiceProxy,
    private _refAgensiServiceProxy: RefAgensiServiceProxy,
    private router: Router,
    private calendar: NgbCalendar
  ) {
    this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
    this.getAgensi();
    this.getAddSKB();
  }

  toModel(date: NgbDateStruct | null): string | null {
    return date ? date.year + this.DELIMITER + date.month + this.DELIMITER + date.day : null;
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
		const modalRef = this.modalService.open(TambahBelanjaBulanan, { size: 'md' });
		modalRef.componentInstance.name = 'add';
    modalRef.componentInstance.kategori = 1;

    modalRef.result.then(
			(response) => {
				if (response) {
          this.idBulan = this.idBulan + 1;
          this.rows.push({ id: this.idBulan, tahun: response.tahun, bulan: response.bulan, jumlah: response.jumlah });
          this.getAddSKB();
          this.calculateTotal();
          this.calculateBalance();
				}
			}
		);
	}

  editBulanan(idBulan, tahun, bulan, jumlah) {
		const modalRef = this.modalService.open(TambahBelanjaBulanan, { size: 'md' });
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
          this.calculateTotal();
          this.calculateBalance();
				}
			}
		);
	}

  deleteBulanan(id) {
    this.rows.splice(this.rows.findIndex(e=> e.id == id), 1);
    this.getAddSKB();
    this.calculateTotal();
    this.calculateBalance();
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
          this.skb.id_tabung_kelulusan = response.id;
					this.no_rujukan_kelulusan = response.no_rujukan_kelulusan;
				}
			}
		);
	}

	pilihTabung() {
		const modalRef = this.modalService.open(PilihanTabungComponent, { size: 'xl' });
		modalRef.componentInstance.name = 'add';
    modalRef.result.then(
			(response) => {
				if (response) {
          this.skb.id_tabung = response.id;
          this.nama_tabung = response.nama_tabung;
				}
			}
		);
	}

	pilihBencana() {
		const modalRef = this.modalService.open(PilihanBencanaComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
    modalRef.result.then(
			(response) => {
				if (response) {
          this.skb.id_bencana = response.id;
          this.nama_bencana = response.nama_bencana;
				}
			}
		);
	}

  calculateBalance() {
    this.balance_peruntukan = this.skb.jumlah_siling_peruntukan - this.belanja;
  }

  calculateTotal() {
    this.belanja = 0;
    this.rows.forEach(e=> {
      this.belanja += parseFloat(e.jumlah);
    })
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
    if(this.modelMula){
      this.tarikhMula = this.toModel(this.modelMula);
      this.bayaranSKB.skb.tarikh_mula = moment(this.tarikhMula, "YYYY-MM-DD");
    }
    if(this.modelTamat){
      this.tarikhTamat = this.toModel(this.modelTamat);
      this.bayaranSKB.skb.tarikh_tamat = moment(this.tarikhTamat, "YYYY-MM-DD");
    }
    this.bayaranSKB.skb.no_rujukan_skb = null;
    this.bayaranSKB.skb.perihal = null;
    this.bayaranSKB.skb.jumlah_baki_peruntukan = this.balance_peruntukan;
    this.bayaranSKB.skbBulanan = this.bulanan;
		this._tabungBayaranSkbServiceProxy
			.createOrEdit(this.bayaranSKB)
			.pipe()
			.subscribe((result) => {
        this.output = result;
        if(this.output.message == "Maklumat Berjaya Ditambah!"){
          Swal.fire('Berjaya!', 'Maklumat Surat Kuasa Belanja Berjaya Dihantar.', 'success').then(() => {
            this.router.navigateByUrl('/app/tabung/skb/senarai');
          });
        }else{
          Swal.fire('Tidak Berjaya!', this.output.message, 'error');
        }
			});
	}
}
