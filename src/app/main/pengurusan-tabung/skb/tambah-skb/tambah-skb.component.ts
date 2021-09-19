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
  TabungBayaranSkbServiceProxy,
  TabungKelulusanServiceProxy
} from 'src/app/shared/proxy/service-proxies';
import { TambahBelanjaBulanan } from '../tambah-belanja-bulanan/tambah-belanja-bulanan.component';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { swalError, swalSuccess } from '@shared/sweet-alert/swal-constant';
import { PilihanBencanaComponent } from '../pilihan-bencana/pilihan-bencana.component';
import { fadeVerticalAnimation } from '@app/shared/data/router-animation/fade-vertical-animation';
@Component({
	selector: 'app-tambah-skb',
	templateUrl: './tambah-skb.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal, NgbActiveModal],
  animations: [fadeVerticalAnimation]
})
export class TambahSkbComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

  bayaranSKB: InputCreateBayaranSkbDto =  new InputCreateBayaranSkbDto();
  skb: CreateOrEditTabungBayaranSkbDto = new CreateOrEditTabungBayaranSkbDto();
  output: OutputCreateBayaranSkbDto = new OutputCreateBayaranSkbDto();
  bulanan: InputSkbBulananDto[] = [];

  idKelulusan: any;
  agencies: any;
  filter: string;
  saving = false;
  tarikhMula: string;
  tarikhTamat: string;
  idBulan: number = 0;
  rows = [];
  belanja: number = 0;
  balance_peruntukan: number = 0;
  tarikh_bencana: string;

  date = new Date();
  modelBencana: NgbDateStruct;
  modelMula: NgbDateStruct;
  modelTamat: NgbDateStruct;
  today = this.calendar.getToday();
  readonly DELIMITER = '-';

  categories = [
    { id: 1, kategori: "Covid" },
    { id: 2, kategori: "Bukan Covid" }
  ]

  bayaran = [
    { id: 1, jenis_bayaran: "Bantuan Wang Ihsan" },
    { id: 2, jenis_bayaran: "Pengoperasian" }
  ]

	constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private _activatedRoute: ActivatedRoute,
    private _tabungBayaranSkbServiceProxy: TabungBayaranSkbServiceProxy,
    private _tabungKelulusanServiceProxy: TabungKelulusanServiceProxy,
    private _refAgensiServiceProxy: RefAgensiServiceProxy,
    private router: Router,
    private calendar: NgbCalendar
  ) {
    this.idKelulusan = this._activatedRoute.snapshot.queryParams['id_kelulusan'];
    this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
    if(this.idKelulusan) {
      this.getKelulusan();
    }
    this.getAgensi();
    this.getAddSKB();
  }

  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      let date = value.split(this.DELIMITER);
      return {
        year : parseInt(date[0], 10),
        month : parseInt(date[1], 10),
        day : parseInt(date[2], 10)
      };
    }
    return null;
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

  getKelulusan() {
    this._tabungKelulusanServiceProxy.getTabungKelulusanForEdit(this.idKelulusan).subscribe((result)=>{
      this.skb.no_rujukan_kelulusan = result.tabung_kelulusan.no_rujukan_kelulusan;
      this.skb.id_tabung_kelulusan = this.idKelulusan;
    })
  }

	addNoReference() {
		const modalRef = this.modalService.open(PilihanRujukanKelulusanComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
    modalRef.result.then(
			(response) => {
				if (response) {
          this.skb.id_tabung_kelulusan = response.id;
					this.skb.no_rujukan_kelulusan = response.no_rujukan_kelulusan;
          this.skb.id_tabung = response.id_tabung;
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
          this.skb.nama_bencana = response.nama_bencana;
          this.modelBencana = this.fromModel(response.tarikh_bencana.format('YYYY-MM-DD'));
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
    this.bayaranSKB.skb.jumlah_baki_peruntukan = this.balance_peruntukan;
    this.bayaranSKB.skbBulanan = this.bulanan;
		this._tabungBayaranSkbServiceProxy
			.createOrEdit(this.bayaranSKB)
			.pipe()
			.subscribe((result) => {
        this.output = result;
        if(this.output.message == "Maklumat Berjaya Ditambah!"){
          swalSuccess.fire('Berjaya!', 'Maklumat Surat Kuasa Belanja Berjaya Dihantar.', 'success').then(() => {
            this.router.navigateByUrl('/app/tabung/skb/senarai');
          });
        }else{
          swalError.fire('Tidak Berjaya!', this.output.message, 'error');
        }
			});
	}
}
