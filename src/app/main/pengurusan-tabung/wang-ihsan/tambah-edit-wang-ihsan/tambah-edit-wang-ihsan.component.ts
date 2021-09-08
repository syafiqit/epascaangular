import { OnInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbCalendar, NgbDateStruct, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { TambahKetuaIsiRumahComponent } from '../tambah-ketua-isi-rumah/tambah-ketua-isi-rumah.component';
import {
  CreateOrEditTabungBwiDto,
  InputBwiKirDto,
  InputCreateTabungBwiDto,
  TabungBwiServiceProxy
} from 'src/app/shared/proxy/service-proxies';
import { PilihPembayaranComponent } from '../pilih-pembayaran/pilih-pembayaran.component';
import { swalSuccess } from '@shared/sweet-alert/swal-constant';
import { fadeVerticalAnimation } from '@app/shared/data/router-animation/fade-vertical-animation';
import { TambahBantuanComponent } from '../tambah-bantuan/tambah-bantuan.component';
import { PilihanBencanaComponent } from '../../skb/pilihan-bencana/pilihan-bencana.component';
@Component({
	selector: 'app-tambah-edit-wang-ihsan',
	templateUrl: './tambah-edit-wang-ihsan.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal, NgbActiveModal],
  animations: [fadeVerticalAnimation]
})
export class TambahEditWangIhsanComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

  tabungBwi: InputCreateTabungBwiDto = new InputCreateTabungBwiDto();
  bwi: CreateOrEditTabungBwiDto = new CreateOrEditTabungBwiDto();
  bwiKir: InputBwiKirDto[] = [];

  nama_pembayaran:string;
  bwiType: any;
  id_bencana: number;
  nama_bencana: string;

  tarikh_bencana: string;
  bayaran: number = 0;

  pembayaran = [];
  bantuan = [];
  rows = [];
  saving = false;
  jumlahKir = this.rows.length;
  tarikhKejadian: string;

  date = new Date();
  modelBencana: NgbDateStruct;
  modelKejadian: NgbDateStruct;
  today = this.calendar.getToday();
  readonly DELIMITER = '-';

  bwiCategory = [
    { id: 1, nama_jenis_bwi: "Bencana" },
    { id: 2, nama_jenis_bwi: "Pengurusan Kematian" },
    { id: 3, nama_jenis_bwi: "Lain-lain" }
  ]

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

	getPembayaran(event?: LazyLoadEvent) {
		if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this.primengTableHelper.totalRecordsCount = this.pembayaran.length;
		this.primengTableHelper.records = this.pembayaran;
		this.primengTableHelper.hideLoadingIndicator();
	}

	getBantuan(event?: LazyLoadEvent) {
		if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this.primengTableHelper.totalRecordsCount = this.bantuan.length;
		this.primengTableHelper.records = this.bantuan;
		this.primengTableHelper.hideLoadingIndicator();
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

	pilihPembayaran() {
		const modalRef = this.modalService.open(PilihPembayaranComponent, { size: 'lg' });
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
          this.getPembayaran();
				}
			},
			() => {}
		);
	}

	pilihBencana() {
		const modalRef = this.modalService.open(PilihanBencanaComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
    modalRef.result.then(
			(response) => {
				if (response) {
          this.id_bencana = response.id;
          this.nama_bencana = response.nama_bencana;
          this.modelBencana = this.fromModel(response.tarikh_bencana.format('YYYY-MM-DD'));
				}
			}
		);
	}

  addBantuan() {
		this.modalService.open(TambahBantuanComponent, { size: 'lg' });
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
    if(this.modelKejadian){
      this.tarikhKejadian = this.toModel(this.modelKejadian);
      this.tabungBwi.bwi.tarikh_eft = moment(this.tarikhKejadian, "YYYY-MM-DD");
    }
    this.tabungBwi.bwiKir = this.bwiKir;
    this._tabungBwiServiceProxy
			.createOrEdit(this.tabungBwi)
			.pipe()
			.subscribe((result) => {
				swalSuccess.fire('Berjaya!', 'Maklumat Bantuan Wang Ihsan Berjaya Dihantar.', 'success').then(() => {
          this.router.navigateByUrl('/app/tabung/senarai-wang-ihsan');
				});
			});
	}
}
