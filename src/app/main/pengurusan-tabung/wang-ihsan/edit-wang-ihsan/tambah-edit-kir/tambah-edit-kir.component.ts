import { Component, OnInit, ViewChild, ViewEncapsulation, } from '@angular/core';
import { PrimengTableHelper } from '@app/shared/helpers/PrimengTableHelper';
import { CreateOrEditTabungBwiKawasanDto, GetTabungBwiForEditDto, InputCreateBwiTabungKawasanDto, MangsaWangIhsanServiceProxy, TabungBwiKawasanServiceProxy} from '@app/shared/proxy/service-proxies';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { NgbActiveModal, NgbCalendar, NgbDateStruct, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { swalSuccess } from '@app/shared/sweet-alert/swal-constant';
import { ConfirmationService } from '@services/confirmation';
import * as moment from 'moment';

@Component({
  selector: 'app-tambah-edit-kir',
  templateUrl: './tambah-edit-kir.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal, NgbActiveModal]
})
export class TambahEditKirComponent implements OnInit {

  @ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

  primengTableHelper: PrimengTableHelper;

  edit: GetTabungBwiForEditDto = new GetTabungBwiForEditDto();
  bantuanKawasan: CreateOrEditTabungBwiKawasanDto = new CreateOrEditTabungBwiKawasanDto();
  inputBantuanKawasan: InputCreateBwiTabungKawasanDto = new InputCreateBwiTabungKawasanDto();

  filter: string;
  rows = [];

  tarikhEft: string;
  tarikhAkuanKp: string;
  tarikhPenyaluran: string;
  tarikhLaporan: string;
  tarikhMaklum: string;
  tarikhMajlis: string;
  tarikhDueReport: string;
  tarikhPerakuan: string;
  tarikhMaklumanMajlis: string;
  tarikhmajlis: string;
  tarikhSuratLaporan: string;
  idKawasan: number;
  idBencana: number;
  idJenisBwi: number;
  idBwi: number;
  idDaerah: number;
  jumlahBelumDibayar: number;
  bilBelumDibayar: number;
  jumlahDibayar: number;
  bilDibayar: number;
  jumlahDipulangkan: number;
  bilDipulangkan: number;

  date = new Date();
  modelDueReport: NgbDateStruct;
  modelEft: NgbDateStruct;
  modelPerakuan: NgbDateStruct;
  modelPenyaluran: NgbDateStruct;
  modelLaporan: NgbDateStruct;
  modelMaklumanMajlis: NgbDateStruct;
  modelMajlis: NgbDateStruct;
  modelSuratLaporan: NgbDateStruct;
  today = this.calendar.getToday();
  readonly DELIMITER = '-';
  statuses: any;

  status=[
    {id: 1, nama_status: "Belum Dibayar"},
    {id: 2, nama_status: "Dibayar"},
    {id: 3, nama_status: "Dipulangkan"}
  ]

  constructor(
    config: NgbModalConfig,
    private calendar: NgbCalendar,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _confirmationService: ConfirmationService,
    private tabungBwiKawasanServiceProxy: TabungBwiKawasanServiceProxy,
    private mangsaWangIhsanServiceProxy: MangsaWangIhsanServiceProxy
  ) {
    this.idKawasan = this._activatedRoute.snapshot.queryParams['idKawasan'];
    this.idBencana = this._activatedRoute.snapshot.queryParams['idBencana'];
    this.idJenisBwi = this._activatedRoute.snapshot.queryParams['idJenisBwi'];
    this.idBwi = this._activatedRoute.snapshot.queryParams['idBwi'];
    this.idDaerah = this._activatedRoute.snapshot.queryParams['idDaerah'];
    this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
   }

  ngOnInit(): void {
    this.getJumlahBayaran();
    this.getBantuanKawasan();
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

  getKir(event?: LazyLoadEvent) {
    if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this.mangsaWangIhsanServiceProxy
			.getAllMangsaByBencanaAndJenisBwi(
				this.filter,
        this.idBencana ?? undefined,
        this.idJenisBwi ?? undefined,
        this.idDaerah ?? undefined,
				this.primengTableHelper.getSorting(this.dataTable),
				this.primengTableHelper.getSkipCount(this.paginator, event),
				this.primengTableHelper.getMaxResultCount(this.paginator, event)
			)
      .pipe(finalize(()=> {
        this.primengTableHelper.hideLoadingIndicator();
      }))
			.subscribe((result) => {
				this.primengTableHelper.totalRecordsCount = result.total_count;
				this.primengTableHelper.records = result.items;
			});
	}

  getStatus (id){
    this.statuses = this.status.map((data) => {
      return data.nama_status;
    });
    return this.statuses[id - 1];
  }

  getJumlahBayaran(){
    this.mangsaWangIhsanServiceProxy.getTotalBwiMangsaByIdBencana(this.idBencana, this.idJenisBwi,this.idDaerah).subscribe((result) => {
      this.jumlahBelumDibayar = result.jumlah_belum_dibayar;
      this.bilBelumDibayar = result.bil_belum_dibayar;
      this.jumlahDibayar = result.jumlah_dibayar;
      this.bilDibayar = result.bil_dibayar;
      this.jumlahDipulangkan = result.jumlah_dipulangkan;
      this.bilDipulangkan = result.bil_dipulangkan;
    });
  }

  getBantuanKawasan(){
    this.tabungBwiKawasanServiceProxy.getTabungBwiKawasanForEdit(this.idKawasan).subscribe((result) => {
      this.bantuanKawasan = result.tabung_bwi_kawasan;
      if(result.tabung_bwi_kawasan.tarikh_eft){
        this.modelEft = this.fromModel(result.tabung_bwi_kawasan.tarikh_eft.format('YYYY-MM-DD'));
      }
      if(result.tabung_bwi_kawasan.due_report){
        this.modelDueReport = this.fromModel(result.tabung_bwi_kawasan.due_report.format('YYYY-MM-DD'));
      }
      if(result.tabung_bwi_kawasan.tarikh_akuan_kp){
        this.modelPerakuan = this.fromModel(result.tabung_bwi_kawasan.tarikh_akuan_kp.format('YYYY-MM-DD'));
      }
      if(result.tabung_bwi_kawasan.tarikh_saluran_kpd_bkp){
        this.modelPenyaluran = this.fromModel(result.tabung_bwi_kawasan.tarikh_saluran_kpd_bkp.format('YYYY-MM-DD'));
      }
      if(result.tabung_bwi_kawasan.tarikh_laporan_kpd_bkp){
        this.modelLaporan = this.fromModel(result.tabung_bwi_kawasan.tarikh_laporan_kpd_bkp.format('YYYY-MM-DD'));
      }
      if(result.tabung_bwi_kawasan.tarikh_makluman_majlis){
        this.modelMaklumanMajlis = this.fromModel(result.tabung_bwi_kawasan.tarikh_makluman_majlis.format('YYYY-MM-DD'));
      }
      if(result.tabung_bwi_kawasan.tarikh_majlis_makluman_majlis){
        this.modelMajlis = this.fromModel(result.tabung_bwi_kawasan.tarikh_majlis_makluman_majlis.format('YYYY-MM-DD'));
      }
      if(result.tabung_bwi_kawasan.tarikh_majlis_drp_apm){
        this.modelSuratLaporan = this.fromModel(result.tabung_bwi_kawasan.tarikh_majlis_drp_apm.format('YYYY-MM-DD'));
      }

    });
  }

  save(){
    if(this.modelEft){
      this.tarikhEft = this.toModel(this.modelEft);
      this.bantuanKawasan.tarikh_eft = moment(this.tarikhEft, "YYYY-MM-DD");
    }
    if(this.modelDueReport){
      this.tarikhDueReport = this.toModel(this.modelDueReport);
      this.bantuanKawasan.due_report = moment(this.tarikhDueReport, "YYYY-MM-DD");
    }
    if(this.modelPerakuan){
      this.tarikhPerakuan = this.toModel(this.modelPerakuan);
      this.bantuanKawasan.tarikh_akuan_kp = moment(this.tarikhPerakuan, "YYYY-MM-DD");
    }
    if(this.modelPenyaluran){
      this.tarikhPenyaluran = this.toModel(this.modelPenyaluran);
      this.bantuanKawasan.tarikh_saluran_kpd_bkp = moment(this.tarikhPenyaluran, "YYYY-MM-DD");
    }
    if(this.modelLaporan){
      this.tarikhLaporan = this.toModel(this.modelLaporan);
      this.bantuanKawasan.tarikh_laporan_kpd_bkp = moment(this.tarikhLaporan, "YYYY-MM-DD");
    }
    if(this.modelMaklumanMajlis){
      this.tarikhMaklumanMajlis = this.toModel(this.modelMaklumanMajlis);
      this.bantuanKawasan.tarikh_majlis_makluman_majlis = moment(this.tarikhMaklumanMajlis, "YYYY-MM-DD");
    }
    if(this.modelMajlis){
      this.tarikhmajlis = this.toModel(this.modelMajlis);
      this.bantuanKawasan.tarikh_majlis_makluman_majlis = moment(this.tarikhmajlis, "YYYY-MM-DD");
    }
    if(this.modelSuratLaporan){
      this.tarikhSuratLaporan = this.toModel(this.modelSuratLaporan);
      this.bantuanKawasan.tarikh_majlis_drp_apm = moment(this.tarikhSuratLaporan, "YYYY-MM-DD");
    }
    this.tabungBwiKawasanServiceProxy
			.createOrEdit(this.bantuanKawasan)
			.pipe()
			.subscribe((result) => {
        const dialogRef = this._confirmationService.open({
          title: 'Berjaya',
          message: 'Maklumat Bantuan Berjaya Dikemaskini.',
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
          this._router.navigateByUrl('app/tabung/senarai-wang-ihsan');
        });
			});
  }
}
