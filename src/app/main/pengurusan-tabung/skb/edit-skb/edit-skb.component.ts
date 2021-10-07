import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { NgbActiveModal, NgbCalendar, NgbDateStruct, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { PilihanRujukanKelulusanComponent } from '../pilihan-rujukan-kelulusan/pilihan-rujukan-kelulusan.component';
import {
  CreateOrEditTabungBayaranSkbDto,
  GetTabungBayaranSkbForEditDto,
  InputCreateBayaranSkbDto,
  InputSkbBulananDto,
  OutputCreateSkbBulananDto,
  RefAgensiServiceProxy,
  TabungBayaranSkbBulananServiceProxy,
  TabungBayaranSkbServiceProxy
} from 'src/app/shared/proxy/service-proxies';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { PilihanBencanaComponent } from '../pilihan-bencana/pilihan-bencana.component';
import { fadeVerticalAnimation } from '@app/shared/data/router-animation/fade-vertical-animation';
import { finalize } from 'rxjs/operators';
import { TambahBelanjaBulanan } from '../tambah-belanja-bulanan/tambah-belanja-bulanan.component';
import { ConfirmationService } from '@app/shared/services/confirmation';
@Component({
	selector: 'app-edit-skb',
	templateUrl: './edit-skb.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal, NgbActiveModal],
  animations: [fadeVerticalAnimation]
})
export class EditSkbComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

  edit: GetTabungBayaranSkbForEditDto = new GetTabungBayaranSkbForEditDto();
  bayaranSKB: InputCreateBayaranSkbDto =  new InputCreateBayaranSkbDto();
  skb: CreateOrEditTabungBayaranSkbDto = new CreateOrEditTabungBayaranSkbDto();
  bulanan: InputSkbBulananDto[] = [];
  output: OutputCreateSkbBulananDto = new OutputCreateSkbBulananDto();

  idSkb: any;
  agencies: any;
  filter: string;
  saving = false;
  tarikhSurat: string;
  tarikhMula: string;
  tarikhTamat: string;
  rows = [];
  id_jenis_bencana: number;
  id_kategori_skb: number;
  nama_bencana: string;
  tarikh_bencana: string;
  status_skb_bulanan: any = 1;
  belanja: number = 0;
  id_status_skb: number;
  catatan_skb: string;

  date = new Date();
  modelSurat: NgbDateStruct;
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

  statuses = [
    { id: 1, nama: "Aktif" },
    { id: 2, nama: "Tamat Tempoh" },
    { id: 3, nama: "Lanjut" }
  ]

	constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private _activatedRoute: ActivatedRoute,
    private _tabungBayaranSkbServiceProxy: TabungBayaranSkbServiceProxy,
    private _tabungBayaranSkbBulananServiceProxy: TabungBayaranSkbBulananServiceProxy,
    private _refAgensiServiceProxy: RefAgensiServiceProxy,
    private _confirmationService: ConfirmationService,
    private calendar: NgbCalendar,
    private router: Router
  ) {
    this.idSkb = this._activatedRoute.snapshot.queryParams['id'];
    this.primengTableHelper = new PrimengTableHelper();
    this.edit.tabung_bayaran_skb = new CreateOrEditTabungBayaranSkbDto();
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
    this._tabungBayaranSkbServiceProxy.getTabungBayaranSkbForEdit(this.idSkb).subscribe((result)=>{
      this.edit = result;
      this.edit.tabung_bayaran_skb = result.tabung_bayaran_skb;
      this.id_status_skb = result.tabung_bayaran_skb.id_status_skb;
      this.catatan_skb = result.tabung_bayaran_skb.catatan;
      if(result.tabung_bayaran_skb.tarikh_surat_skb){
        this.modelSurat = this.fromModel(result.tabung_bayaran_skb.tarikh_surat_skb.format('YYYY-MM-DD'));
      }
      if(result.tabung_bayaran_skb.tarikh_bencana){
        this.modelBencana = this.fromModel(result.tabung_bayaran_skb.tarikh_bencana.format('YYYY-MM-DD'));
      }
      if(result.tabung_bayaran_skb.tarikh_mula){
        this.modelMula = this.fromModel(result.tabung_bayaran_skb.tarikh_mula.format('YYYY-MM-DD'));
      }
      if(result.tabung_bayaran_skb.tarikh_tamat){
        this.modelTamat = this.fromModel(result.tabung_bayaran_skb.tarikh_tamat.format('YYYY-MM-DD'));
      }
      this.belanja = result.tabung_bayaran_skb.jumlah_siling_peruntukan - result.tabung_bayaran_skb.jumlah_baki_peruntukan;
    })
  }

  getAgensi(filter?) {
		this._refAgensiServiceProxy.getRefAgensiForDropdown(filter).subscribe((result) => {
			this.agencies = result.items;
		});
	}

	getBulananSKB(event?: LazyLoadEvent) {
		if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this._tabungBayaranSkbBulananServiceProxy
			.getAllBulananbyIdSkb(
				this.filter,
        this.idSkb,
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
		const modalRef = this.modalService.open(PilihanRujukanKelulusanComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
    modalRef.result.then(
			(response) => {
				if (response) {
          this.edit.tabung_bayaran_skb.id_tabung_kelulusan = response.id;
					this.edit.tabung_bayaran_skb.no_rujukan_kelulusan = response.no_rujukan_kelulusan;
          this.edit.tabung_bayaran_skb.id_tabung = response.id_tabung;
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
          this.edit.tabung_bayaran_skb.id_bencana = response.id;
          this.edit.tabung_bayaran_skb.nama_bencana = response.nama_bencana;
          this.modelBencana = this.fromModel(response.tarikh_bencana.format('YYYY-MM-DD'));
				}
			}
		);
	}

  addBulanan(id_tabung_bayaran_skb) {
		const modalRef = this.modalService.open(TambahBelanjaBulanan, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
    modalRef.componentInstance.kategori = 2;
    modalRef.componentInstance.id_tabung_bayaran_skb = id_tabung_bayaran_skb;
    modalRef.componentInstance.id_tabung = this.edit.tabung_bayaran_skb.id_tabung;
    modalRef.result.then(
			(response) => {
				if (response) {
          this.rows.push({ tahun: response.tahun, bulan: response.bulan, id_bulan: response.id_bulan, jumlah: response.jumlah });
          this.getBulananSKB();
          this.show();
          const monthly = new InputSkbBulananDto();
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

  editBulanan(id, id_tabung_bayaran_skb) {
		const modalRef = this.modalService.open(TambahBelanjaBulanan, { size: 'lg' });
		modalRef.componentInstance.name = 'edit';
		modalRef.componentInstance.id = id;
		modalRef.componentInstance.id_tabung_bayaran_skb = id_tabung_bayaran_skb;
    modalRef.componentInstance.id_tabung = this.edit.tabung_bayaran_skb.id_tabung;
    modalRef.componentInstance.jumlah_baki_peruntukan = this.edit.tabung_bayaran_skb.jumlah_baki_peruntukan;
    modalRef.result.then(
			(response) => {
				if (response) {
          this.rows.push({ tahun: response.tahun, bulan: response.bulan, id_bulan: response.id_bulan, jumlah: response.jumlah });
          this.getBulananSKB();
          this.show();
          const monthly = new InputSkbBulananDto();
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

  deleteSkbBulanan(id){
    const dialogRef = this._confirmationService.open({
      title: 'Anda Pasti?',
      message: 'Adakah anda pasti ingin memadam maklumat Belanja Bulanan SKB ini?',
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
				this._tabungBayaranSkbBulananServiceProxy.delete(id).subscribe((result)=>{
          this.output = result;
          if(this.output.message == "Surat Kuasa Belanja Bulanan Berjaya Dibuang"){
            const dialogRef = this._confirmationService.open({
              title: 'Berjaya',
              message: 'Maklumat Belanja Bulanan SKB Dipilih Berjaya Dipadam!',
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
              this.getBulananSKB();
              this.show();
            });
          }
        })
      }
    });
  }

	save() {
    this.saving = true;
    this.bayaranSKB.skb = this.edit.tabung_bayaran_skb;
    if(this.modelSurat){
      this.tarikhSurat = this.toModel(this.modelSurat);
      this.bayaranSKB.skb.tarikh_surat_skb = moment(this.tarikhSurat, "YYYY-MM-DD");
    }
    if(this.modelMula){
      this.tarikhMula = this.toModel(this.modelMula);
      this.bayaranSKB.skb.tarikh_mula = moment(this.tarikhMula, "YYYY-MM-DD");
    }
    if(this.modelTamat){
      this.tarikhTamat = this.toModel(this.modelTamat);
      this.bayaranSKB.skb.tarikh_tamat = moment(this.tarikhTamat, "YYYY-MM-DD");
    }
    if(this.id_status_skb != this.edit.tabung_bayaran_skb.id_status_skb) {
      this.bayaranSKB.changeStatus = this.id_status_skb;
      this.bayaranSKB.catatan = this.catatan_skb ?? null;
    }
    if(this.id_status_skb == this.edit.tabung_bayaran_skb.id_status_skb) {
      this.bayaranSKB.changeStatus = null;
      this.bayaranSKB.catatan = this.catatan_skb ?? null;
    }
		this._tabungBayaranSkbServiceProxy
			.createOrEdit(this.bayaranSKB)
			.pipe()
			.subscribe(() => {
        const dialogRef = this._confirmationService.open({
          title: 'Berjaya',
          message: 'Maklumat Surat Kuasa Belanja Berjaya Dikemaskini.',
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
          this.router.navigateByUrl('/app/tabung/skb/senarai');
        });
			});
	}
}
