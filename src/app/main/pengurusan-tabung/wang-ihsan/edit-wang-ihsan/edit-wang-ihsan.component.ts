import { OnInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import {
  CreateOrEditTabungBwiDto,
  GetRujukanKelulusanBwiDto,
  GetTabungBwiForEditDto,
  InputBwiKirDto,
  InputCreateTabungBwiDto,
  TabungBwiKirServiceProxy,
  TabungBwiServiceProxy
} from 'src/app/shared/proxy/service-proxies';
import { TambahNoRujukanComponent } from '../tambah-no-rujukan/tambah-no-rujukan.component';
import { TambahKetuaIsiRumahComponent } from '../tambah-ketua-isi-rumah/tambah-ketua-isi-rumah.component';
import * as moment from 'moment';
declare let require;
const Swal = require('sweetalert2');
@Component({
	selector: 'app-edit-wang-ihsan',
	templateUrl: './edit-wang-ihsan.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal, NgbActiveModal]
})
export class EditWangIhsanComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

  edit: GetTabungBwiForEditDto = new GetTabungBwiForEditDto();
  tabungBwi: InputCreateTabungBwiDto = new InputCreateTabungBwiDto();
  bwi: CreateOrEditTabungBwiDto = new CreateOrEditTabungBwiDto();
  bwiKir: InputBwiKirDto[] = [];
  kelulusan: GetRujukanKelulusanBwiDto = new GetRujukanKelulusanBwiDto();

  idBwi: any;
  filter: string;
  no_rujukan_kelulusan: string;
  nama_jenis_bencana: string;
  rujukan_surat: string;
  nama_tabung: string;
  perihal_surat: string;
  rows = [];

  saving = false;
  date = new Date();
  tarikhEft: string;
  tarikhAkuanKp: string;
  tarikhPenyaluran: string;
  tarikhLaporan: string;
  tarikhMaklum: string;
  tarikhMajlis: string;

	constructor(
    private router: Router,
    config: NgbModalConfig,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private _activatedRoute: ActivatedRoute,
    private _tabungBwiServiceProxy: TabungBwiServiceProxy,
    private _tabungBwiKirServiceProxy: TabungBwiKirServiceProxy
  ) {
    this.idBwi = this._activatedRoute.snapshot.queryParams['id'];
		this.primengTableHelper = new PrimengTableHelper();
    this.edit.tabung_bwi = new CreateOrEditTabungBwiDto();
    this.edit.rujukan_kelulusan_bwi = new GetRujukanKelulusanBwiDto();
    this.edit.nama_tabung = this.nama_tabung;
    this.edit.nama_jenis_bencana = this.nama_jenis_bencana;
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
    this.show();
  }

  show() {
    this._tabungBwiServiceProxy.getTabungBwiForEdit(this.idBwi).subscribe((result)=>{
      this.edit = result;
      this.edit.tabung_bwi = result.tabung_bwi;
      this.no_rujukan_kelulusan = result.rujukan_kelulusan_bwi.no_rujukan_kelulusan;
      this.nama_tabung = result.nama_tabung;
      this.nama_jenis_bencana = result.nama_jenis_bencana;
      this.tarikhEft = result.tabung_bwi.tarikh_eft.format('YYYY-MM-DD');
      this.tarikhAkuanKp = result.tabung_bwi.tarikh_akuan_kp.format('YYYY-MM-DD');
      this.tarikhPenyaluran = result.tabung_bwi.tarikh_saluran_kpd_bkp.format('YYYY-MM-DD');
      this.tarikhLaporan = result.tabung_bwi.tarikh_laporan_kpd_bkp.format('YYYY-MM-DD');
      this.tarikhMaklum = result.tabung_bwi.tarikh_makluman_majlis.format('YYYY-MM-DD');
      this.tarikhMajlis = result.tabung_bwi.tarikh_majlis_makluman_majlis.format('YYYY-MM-DD');
    })
  }

	getKir(event?: LazyLoadEvent) {
    if (this.primengTableHelper.shouldResetPaging(event)) {
      this.paginator.changePage(0);
      return;
    }
    this.primengTableHelper.showLoadingIndicator();

    this._tabungBwiKirServiceProxy
    .getAllKirById(
      this.filter,
      this.idBwi,
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

  addKirModal(id_tabung_bwi) {
		const modalRef = this.modalService.open(TambahKetuaIsiRumahComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
    modalRef.componentInstance.kategori = 2;
    modalRef.componentInstance.id_tabung_bwi = id_tabung_bwi;
    modalRef.result.then(
			(response) => {
				if (response) {
          this.rows.push({ id: response.id, nama: response.nama, jumlah_bwi: response.jumlah_bwi, nama_daerah: response.nama_daerah, nama_negeri: response.nama_negeri });
          this.getKir();
				}
			},
			() => {}
		);
	}

	save() {
    this.saving = true;
    this.tabungBwi.bwi = this.edit.tabung_bwi;
    this.tabungBwi.bwi.tarikh_eft = moment(this.tarikhEft);
    this.tabungBwi.bwi.tarikh_akuan_kp = moment(this.tarikhAkuanKp);
    this.tabungBwi.bwi.tarikh_saluran_kpd_bkp = moment(this.tarikhPenyaluran);
    this.tabungBwi.bwi.tarikh_laporan_kpd_bkp = moment(this.tarikhLaporan);
    this.tabungBwi.bwi.tarikh_makluman_majlis = moment(this.tarikhMaklum);
    this.tabungBwi.bwi.tarikh_majlis_makluman_majlis = moment(this.tarikhMajlis);
    this._tabungBwiServiceProxy
			.createOrEdit(this.tabungBwi)
			.pipe()
			.subscribe((result) => {
				Swal.fire('Berjaya!', 'Maklumat Bantuan Wang Ihsan Berjaya Disimpan.', 'success').then(() => {
          this.router.navigateByUrl('/app/tabung/senarai-wang-ihsan');
				});
			});
	}
}
