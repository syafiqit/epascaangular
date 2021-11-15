import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { NgbActiveModal, NgbCalendar, NgbDateStruct, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import {
  CreateOrEditTabungBayaranWaranDto,
  InputCreateBayaranWaranDto,
  InputWaranBulananDto,
  OutputCreateBayaranWaranDto,
  RefAgensiServiceProxy,
  TabungBayaranWaranServiceProxy
} from 'src/app/shared/proxy/service-proxies';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { fadeVerticalAnimation } from '@app/shared/data/router-animation/fade-vertical-animation';
import { WaranBulananComponent } from '../waran-bulanan/waran-bulanan.component';
import { ConfirmationService } from '@app/shared/services/confirmation';
import { LookupKelulusanComponent } from '../lookup-kelulusan/lookup-kelulusan.component';
@Component({
	selector: 'app-tambah-waran',
	templateUrl: './tambah-waran.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal, NgbActiveModal],
  animations: [fadeVerticalAnimation]
})
export class TambahWaranComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

  bayaranWaran: InputCreateBayaranWaranDto =  new InputCreateBayaranWaranDto();
  waran: CreateOrEditTabungBayaranWaranDto = new CreateOrEditTabungBayaranWaranDto();
  output: OutputCreateBayaranWaranDto = new OutputCreateBayaranWaranDto();
  bulanan: InputWaranBulananDto[] = [];

  agencies: any;
  filter: string;
  saving = false;
  tarikhSurat: string;
  tarikhMula: string;
  tarikhTamat: string;
  idBulan: number = 0;
  rows = [];
  belanja: number = 0;
  balance_peruntukan: number = 0;
  id_tabung_kelulusan: number;
  no_rujukan_kelulusan: string;

  date = new Date();
  modelSurat: NgbDateStruct;
  modelMula: NgbDateStruct;
  modelTamat: NgbDateStruct;
  today = this.calendar.getToday();
  readonly DELIMITER = '-';

	constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private _activatedRoute: ActivatedRoute,
    private _tabungBayaranWaranServiceProxy: TabungBayaranWaranServiceProxy,
    private _refAgensiServiceProxy: RefAgensiServiceProxy,
    private _confirmationService: ConfirmationService,
    private router: Router,
    private calendar: NgbCalendar
  ) {
    this.id_tabung_kelulusan = this._activatedRoute.snapshot.queryParams['kelulusan'];
    this.no_rujukan_kelulusan = this._activatedRoute.snapshot.queryParams['no_ruj'];
    this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
    this.getAgensi();
    this.getWaranBulanan();
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

	getWaranBulanan(event?: LazyLoadEvent) {
		this.primengTableHelper.showLoadingIndicator();
		this.primengTableHelper.totalRecordsCount = this.rows.length;
		this.primengTableHelper.records = this.rows;
		this.primengTableHelper.hideLoadingIndicator();
	}

  addBulanan() {
		const modalRef = this.modalService.open(WaranBulananComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
    modalRef.componentInstance.kategori = 1;
    modalRef.componentInstance.jumlah_baki_peruntukan = this.balance_peruntukan;

    modalRef.result.then(
			(response) => {
				if (response) {
          this.idBulan = this.idBulan + 1;
          this.rows.push({ id: this.idBulan, tahun: response.tahun, bulan: response.bulan, id_bulan: response.id_bulan, jumlah: response.jumlah });
          this.getWaranBulanan();
          this.calculateTotal();
          this.calculateBalance();
				}
			}
		);
	}

  editBulanan(idBulan, tahun, bulan, id_bulan, jumlah) {
		const modalRef = this.modalService.open(WaranBulananComponent, { size: 'md' });
		modalRef.componentInstance.name = 'edit';
    modalRef.componentInstance.kategori = 1;
		modalRef.componentInstance.idBulan = idBulan;
		modalRef.componentInstance.tahun = tahun;
		modalRef.componentInstance.bulan = bulan;
		modalRef.componentInstance.id_bulan = id_bulan;
		modalRef.componentInstance.jumlah = jumlah;
    modalRef.componentInstance.jumlah_baki_peruntukan = this.balance_peruntukan;

    modalRef.result.then(
			(response) => {
				if (response) {
          let d = this.rows.find(e => e.id == response.id);
          d.tahun = response.tahun;
          d.bulan = response.bulan;
          d.id_bulan = response.id_bulan;
          d.jumlah = response.jumlah;
          this.getWaranBulanan();
          this.calculateTotal();
          this.calculateBalance();
				}
			}
		);
	}

  deleteBulanan(id) {
    this.rows.splice(this.rows.findIndex(e=> e.id == id), 1);
    this.getWaranBulanan();
    this.calculateTotal();
    this.calculateBalance();
	}

	reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}

	addNoReference() {
		const modalRef = this.modalService.open(LookupKelulusanComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
    modalRef.result.then(
			(response) => {
				if (response) {
          this.id_tabung_kelulusan = response.id;
					this.no_rujukan_kelulusan = response.no_rujukan_kelulusan;
          this.waran.id_tabung = response.id_tabung;
				}
			}
		);
	}

  calculateBalance() {
    this.balance_peruntukan = this.waran.jumlah_siling_peruntukan - this.belanja;
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
      const monthly = new InputWaranBulananDto();
      monthly.tahun = this.rows[i].tahun;
      monthly.bulan = this.rows[i].bulan;
      monthly.id_bulan = this.rows[i].id_bulan;
      monthly.jumlah = this.rows[i].jumlah;
      this.bulanan.push(monthly);
    }

    this.bayaranWaran.waran = this.waran;
    if(this.modelSurat){
      this.tarikhSurat = this.toModel(this.modelSurat);
      this.bayaranWaran.waran.tarikh_surat_waran = moment(this.tarikhSurat, "YYYY-MM-DD");
    }
    this.waran.id_tabung_kelulusan = this.id_tabung_kelulusan;
    this.waran.no_rujukan_kelulusan = this.no_rujukan_kelulusan;
    this.bayaranWaran.waran.jumlah_baki_peruntukan = this.balance_peruntukan;
    this.bayaranWaran.waranBulanan = this.bulanan;
		this._tabungBayaranWaranServiceProxy
			.createOrEdit(this.bayaranWaran)
			.pipe()
			.subscribe((result) => {
        this.output = result;
        if(this.output.message == "Maklumat Berjaya Ditambah!"){
          const dialogRef = this._confirmationService.open({
            title: 'Berjaya',
            message: 'Maklumat Bayaran Secara Waran Berjaya Dihantar',
            icon: {
              show: true,
              name: 'check-circle',
              color: 'success'
            },
            actions: {
              confirm: {
                show: true,
                label: 'Tutup',
                color: 'primary'
              },
              cancel: {
                show: false
              }
            },
            dismissible: true
          });
          dialogRef.afterClosed().subscribe(() => {
            this.router.navigateByUrl('/app/tabung/waran/senarai');
          });
        }else{
          const dialogRef = this._confirmationService.open({
            title: 'Tidak Berjaya',
            message: this.output.message,
            icon: {
              show: true,
              name: 'x-circle',
              color: 'error'
            },
            actions: {
              confirm: {
                show: true,
                label: 'Tutup',
                color: 'primary'
              },
              cancel: {
                show: false
              }
            },
            dismissible: true
          });
          dialogRef.afterClosed().subscribe(() => {
            this.bulanan = [];
          });
        }
			});
	}
}
