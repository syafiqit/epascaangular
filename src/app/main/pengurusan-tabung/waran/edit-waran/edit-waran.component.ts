import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import {Location} from '@angular/common';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { NgbActiveModal, NgbCalendar, NgbDateStruct, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import {
  CreateOrEditTabungBayaranWaranDto,
  GetTabungBayaranWaranForEditDto,
  InputCreateBayaranWaranDto,
  InputWaranBulananDto,
  OutputCreateWaranBulananDto,
  RefAgensiServiceProxy,
  TabungBayaranWaranBulananServiceProxy,
  TabungBayaranWaranServiceProxy
} from 'src/app/shared/proxy/service-proxies';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { fadeVerticalAnimation } from '@app/shared/data/router-animation/fade-vertical-animation';
import { finalize } from 'rxjs/operators';
import { WaranBulananComponent } from '../waran-bulanan/waran-bulanan.component';
import { ConfirmationService } from '@app/shared/services/confirmation';
import { LookupKelulusanComponent } from '../lookup-kelulusan/lookup-kelulusan.component';
@Component({
	selector: 'app-edit-waran',
	templateUrl: './edit-waran.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal, NgbActiveModal],
  animations: [fadeVerticalAnimation]
})
export class EditWaranComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

  edit: GetTabungBayaranWaranForEditDto = new GetTabungBayaranWaranForEditDto();
  bayaranWaran: InputCreateBayaranWaranDto =  new InputCreateBayaranWaranDto();
  waran: CreateOrEditTabungBayaranWaranDto = new CreateOrEditTabungBayaranWaranDto();
  bulanan: InputWaranBulananDto[] = [];
  output: OutputCreateWaranBulananDto = new OutputCreateWaranBulananDto();

  idWaran: any;
  agencies: any;
  filter: string;
  saving = false;
  tarikhSurat: string;
  rows = [];
  id_jenis_bencana: number;
  id_kategori_waran: number;
  status_waran_bulanan: any = 1;
  belanja: number = 0;
  id_status_waran: number;
  catatan_waran: string;

  date = new Date();
  modelSurat: NgbDateStruct;
  today = this.calendar.getToday();
  readonly DELIMITER = '-';

  statuses = [
    { id: 1, nama: "Aktif" },
    { id: 2, nama: "Tidak Aktif" }
  ]

	constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private _location: Location,
    public activeModal: NgbActiveModal,
    private _activatedRoute: ActivatedRoute,
    private _tabungBayaranWaranServiceProxy: TabungBayaranWaranServiceProxy,
    private _tabungBayaranWaranBulananServiceProxy: TabungBayaranWaranBulananServiceProxy,
    private _refAgensiServiceProxy: RefAgensiServiceProxy,
    private _confirmationService: ConfirmationService,
    private calendar: NgbCalendar,
    private router: Router
  ) {
    this.idWaran = this._activatedRoute.snapshot.queryParams['id'];
    this.primengTableHelper = new PrimengTableHelper();
    this.edit.tabung_bayaran_waran = new CreateOrEditTabungBayaranWaranDto();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
    this.getAgensi();
    this.show();
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

  show() {
    this._tabungBayaranWaranServiceProxy.getTabungBayaranWaranForEdit(this.idWaran).subscribe((result)=>{
      this.edit = result;
      this.edit.tabung_bayaran_waran = result.tabung_bayaran_waran;
      this.id_status_waran = result.tabung_bayaran_waran.id_status_waran;
      this.catatan_waran = result.tabung_bayaran_waran.catatan;
      if(result.tabung_bayaran_waran.tarikh_surat_waran){
        this.modelSurat = this.fromModel(result.tabung_bayaran_waran.tarikh_surat_waran.format('YYYY-MM-DD'));
      }
      this.belanja = result.tabung_bayaran_waran.jumlah_siling_peruntukan - result.tabung_bayaran_waran.jumlah_baki_peruntukan;
    })
  }

  getAgensi(filter?) {
		this._refAgensiServiceProxy.getRefAgensiForDropdown(filter).subscribe((result) => {
			this.agencies = result.items;
		});
	}

	getBulananWaran(event?: LazyLoadEvent) {
		this.primengTableHelper.showLoadingIndicator();
		this._tabungBayaranWaranBulananServiceProxy
			.getAllBulananbyIdWaran(
				this.filter,
        this.idWaran,
				this.primengTableHelper.getSorting(this.dataTable),
				this.primengTableHelper.getSkipCount(this.paginator, event),
				this.primengTableHelper.getMaxResultCount(this.paginator, event)
			)
      .pipe(finalize(()=>{
        this.primengTableHelper.hideLoadingIndicator();
      }))
			.subscribe((result) => {
				this.primengTableHelper.totalRecordsCount = result.total_count;
				this.primengTableHelper.records = result.items;
			});
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
          this.edit.tabung_bayaran_waran.id_tabung_kelulusan = response.id;
					this.edit.tabung_bayaran_waran.no_rujukan_kelulusan = response.no_rujukan_kelulusan;
          this.edit.tabung_bayaran_waran.id_tabung = response.id_tabung;
				}
			},
			() => {}
		);
	}

  addBulanan(id_tabung_bayaran_waran) {
		const modalRef = this.modalService.open(WaranBulananComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
    modalRef.componentInstance.kategori = 2;
    modalRef.componentInstance.id_tabung_bayaran_waran = id_tabung_bayaran_waran;
    modalRef.componentInstance.id_tabung = this.edit.tabung_bayaran_waran.id_tabung;
    modalRef.result.then(
			(response) => {
				if (response) {
          this.rows.push({ tahun: response.tahun, bulan: response.bulan, id_bulan: response.id_bulan, jumlah: response.jumlah });
          this.getBulananWaran();
          this.show();
          const monthly = new InputWaranBulananDto();
          monthly.tahun = response.tahun;
          monthly.bulan = response.bulan;
          monthly.id_bulan = response.id_bulan;
          monthly.jumlah = response.jumlah;
          this.bulanan.push(monthly);
				}
			},
			() => {}
		);
  }

  editBulanan(id, id_tabung_bayaran_waran) {
		const modalRef = this.modalService.open(WaranBulananComponent, { size: 'md' });
		modalRef.componentInstance.name = 'edit';
		modalRef.componentInstance.id = id;
		modalRef.componentInstance.id_tabung_bayaran_waran = id_tabung_bayaran_waran;
    modalRef.componentInstance.id_tabung = this.edit.tabung_bayaran_waran.id_tabung;
    modalRef.componentInstance.jumlah_baki_peruntukan = this.edit.tabung_bayaran_waran.jumlah_baki_peruntukan;
    modalRef.result.then(
			(response) => {
				if (response) {
          this.rows.push({ tahun: response.tahun, bulan: response.bulan, id_bulan: response.id_bulan, jumlah: response.jumlah });
          this.getBulananWaran();
          this.show();
          const monthly = new InputWaranBulananDto();
          monthly.tahun = response.tahun;
          monthly.bulan = response.bulan;
          monthly.id_bulan = response.id_bulan;
          monthly.jumlah = response.jumlah;
          this.bulanan.push(monthly);
				}
			},
			() => {}
		);
  }

  deleteWaranBulanan(id){
    const dialogRef = this._confirmationService.open({
      title: 'Anda Pasti?',
      message: 'Adakah anda pasti ingin memadam maklumat Belanja Bulanan Waran ini?',
      icon: {
        show: true,
        name: 'help-circle',
        color: 'warning'
      },
      actions: {
        confirm: {
          show: true,
          label: 'Ya',
          color: 'primary'
        },
        cancel: {
          show: true,
          label: 'Tidak'
        }
      },
      dismissible: true
    });
    dialogRef.afterClosed().subscribe((e) => {
      if(e === 'confirmed') {
				this._tabungBayaranWaranBulananServiceProxy.delete(id).subscribe((result)=>{
          this.output = result;
          this.resultSave();
        })
      }
    });
  }

  back(){
    this._location.back();
  }

	save() {
    this.saving = true;
    this.bayaranWaran.waran = this.edit.tabung_bayaran_waran;
    if(this.modelSurat){
      this.tarikhSurat = this.toModel(this.modelSurat);
      this.bayaranWaran.waran.tarikh_surat_waran = moment(this.tarikhSurat, "YYYY-MM-DD");
    }
    if(this.id_status_waran != this.edit.tabung_bayaran_waran.id_status_waran) {
      this.bayaranWaran.changeStatus = this.id_status_waran;
      this.bayaranWaran.catatan = this.catatan_waran ?? null;
    }
		this._tabungBayaranWaranServiceProxy
			.createOrEdit(this.bayaranWaran)
			.pipe()
			.subscribe((result) => {
        this.output = result;
        this.resultSave();
			});
	}

  resultSave() {
    if(this.output.message == "Belanja Bulanan Waran Berjaya Dibuang") {
      const dialogRef = this._confirmationService.open({
        title: 'Berjaya',
        message: 'Maklumat Belanja Bulanan Waran Dipilih Berjaya Dipadam',
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
        this.getBulananWaran();
        this.show();
      });
    }
    else if(this.output.message == "Tabung Bayaran Waran Berjaya Dikemaskini") {
      const dialogRef = this._confirmationService.open({
        title: 'Berjaya',
        message: 'Maklumat Bayaran Secara Waran Berjaya Dikemaskini',
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
    }
    else {
      this._confirmationService.open({
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
    }
  }
}
