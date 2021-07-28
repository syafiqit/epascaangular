import { OnInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbCalendar, NgbDateStruct, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { TambahNoRujukanComponent } from '../tambah-no-rujukan/tambah-no-rujukan.component';
import { TambahKetuaIsiRumahComponent } from '../tambah-ketua-isi-rumah/tambah-ketua-isi-rumah.component';
import {
  CreateOrEditTabungBwiDto,
  InputBwiKirDto,
  InputCreateTabungBwiDto,
  TabungBwiServiceProxy
} from 'src/app/shared/proxy/service-proxies';
declare let require;
const Swal = require('sweetalert2');
@Component({
	selector: 'app-tambah-edit-wang-ihsan',
	templateUrl: './tambah-edit-wang-ihsan.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal, NgbActiveModal]
})
export class TambahEditWangIhsanComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

  tabungBwi: InputCreateTabungBwiDto = new InputCreateTabungBwiDto();
  bwi: CreateOrEditTabungBwiDto = new CreateOrEditTabungBwiDto();
  bwiKir: InputBwiKirDto[] = [];

  no_rujukan_kelulusan: number;
  nama_jenis_bencana: string;
  rujukan_surat: string;
  nama_tabung: string;
  perihal_surat: string;

  rows = [];
  saving = false;
  jumlahKir = this.rows.length;
  tarikhEft: string;
  tarikhAkuanKp: string;
  tarikhPenyaluran: string;
  tarikhLaporan: string;
  tarikhMaklum: string;
  tarikhMajlis: string;

  date = new Date();
  modelEft: NgbDateStruct;
  modelPerakuan: NgbDateStruct;
  modelPenyaluran: NgbDateStruct;
  modelLaporan: NgbDateStruct;
  modelMakluman: NgbDateStruct;
  modelMajlis: NgbDateStruct;
  today = this.calendar.getToday();
  readonly DELIMITER = '-';

	constructor(
    private router: Router,
    config: NgbModalConfig,
    private calendar: NgbCalendar,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private _tabungBwiServiceProxy: TabungBwiServiceProxy
  ) {
		config.backdrop = 'static';
		config.keyboard = false;
		this.primengTableHelper = new PrimengTableHelper();
	}

	ngOnInit(): void {}

  toModel(date: NgbDateStruct | null): string | null {
    return date ? date.year + this.DELIMITER + date.month + this.DELIMITER + date.day : null;
  }

	getKir(event?: LazyLoadEvent) {
		if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this.primengTableHelper.totalRecordsCount = this.rows.length;
		this.primengTableHelper.records = this.rows;
		this.primengTableHelper.hideLoadingIndicator();
	}

  addKirModal() {
		const modalRef = this.modalService.open(TambahKetuaIsiRumahComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
    modalRef.componentInstance.kategori = 1;

    modalRef.result.then(
			(response) => {
				if (response) {
          this.rows.push({
            id: response.id,
            nama: response.nama,
            jumlah_bwi: response.jumlah_bwi,
            nama_daerah: response.nama_daerah,
            nama_negeri: response.nama_negeri
          });
          this.getKir();
				}
			},
			() => {}
		);
	}

  deleteKir(id) {
    const index = this.rows.indexOf(id);
    this.rows.splice(index, 1);
    this.getKir();
	}

	reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}

	addNoReference() {
		const modalRef = this.modalService.open(TambahNoRujukanComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
    modalRef.result.then(
			(response) => {
				if (response) {
					this.no_rujukan_kelulusan = response.no_rujukan_kelulusan;
          this.nama_jenis_bencana = response.nama_jenis_bencana;
          this.rujukan_surat = response.rujukan_surat;
          this.nama_tabung = response.nama_tabung;
          this.perihal_surat = response.perihal_surat;
          this.bwi.id_tabung_kelulusan = response.id;
				}
			},
			() => {}
		);
	}

	save() {
    this.saving = true;
    for(let i = 0; i < this.rows.length; i++){
      const ketuaIsiRumah = new InputBwiKirDto();
      ketuaIsiRumah.id_mangsa = this.rows[i].id;
      this.bwiKir.push(ketuaIsiRumah);
    }

    this.tabungBwi.bwi = this.bwi;
    this.tabungBwi.bwi.jumlah_kir = this.jumlahKir;
    if(this.modelEft){
      this.tarikhEft = this.toModel(this.modelEft);
      this.tabungBwi.bwi.tarikh_eft = moment(this.tarikhEft, "YYYY-MM-DD");
    }
    if(this.modelPerakuan){
      this.tarikhAkuanKp = this.toModel(this.modelPerakuan);
      this.tabungBwi.bwi.tarikh_akuan_kp = moment(this.tarikhAkuanKp, "YYYY-MM-DD");
    }
    if(this.modelPenyaluran){
      this.tarikhPenyaluran = this.toModel(this.modelPenyaluran);
      this.tabungBwi.bwi.tarikh_saluran_kpd_bkp = moment(this.tarikhPenyaluran, "YYYY-MM-DD");
    }
    if(this.modelLaporan){
      this.tarikhLaporan = this.toModel(this.modelLaporan);
      this.tabungBwi.bwi.tarikh_laporan_kpd_bkp = moment(this.tarikhLaporan, "YYYY-MM-DD");
    }
    if(this.modelMakluman){
      this.tarikhMaklum = this.toModel(this.modelMakluman);
      this.tabungBwi.bwi.tarikh_makluman_majlis = moment(this.tarikhMaklum, "YYYY-MM-DD");
    }
    if(this.modelMajlis){
      this.tarikhMajlis = this.toModel(this.modelMajlis);
      this.tabungBwi.bwi.tarikh_majlis_makluman_majlis = moment(this.tarikhMajlis, "YYYY-MM-DD");
    }
    this.tabungBwi.bwiKir = this.bwiKir;
    this._tabungBwiServiceProxy
			.createOrEdit(this.tabungBwi)
			.pipe()
			.subscribe((result) => {
				Swal.fire('Berjaya!', 'Maklumat Bantuan Wang Ihsan Berjaya Dihantar.', 'success').then(() => {
          this.router.navigateByUrl('/app/tabung/senarai-wang-ihsan');
				});
			});
	}
}
