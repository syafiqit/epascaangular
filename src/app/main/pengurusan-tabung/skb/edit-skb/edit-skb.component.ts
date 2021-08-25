import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { NgbActiveModal, NgbCalendar, NgbDateStruct, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { PilihanRujukanKelulusanComponent } from '../pilihan-rujukan-kelulusan/pilihan-rujukan-kelulusan.component';
import {
  CreateOrEditTabungBayaranSkbDto,
  GetRujukanKelulusanSkbDto,
  GetTabungBayaranSkbForEditDto,
  InputCreateBayaranSkbDto,
  RefAgensiServiceProxy,
  TabungBayaranSkbServiceProxy
} from 'src/app/shared/proxy/service-proxies';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { PilihanTabungComponent } from '../pilihan-tabung/pilihan-tabung.component';
import { PilihanBencanaComponent } from '../pilihan-bencana/pilihan-bencana.component';
import { PaparBulananComponent } from '../papar-bulanan/papar-bulanan.component';
declare let require;
const Swal = require('sweetalert2');
@Component({
	selector: 'app-edit-skb',
	templateUrl: './edit-skb.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal, NgbActiveModal]
})
export class EditSkbComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

  edit: GetTabungBayaranSkbForEditDto = new GetTabungBayaranSkbForEditDto();
  bayaranSKB: InputCreateBayaranSkbDto =  new InputCreateBayaranSkbDto();
  skb: CreateOrEditTabungBayaranSkbDto = new CreateOrEditTabungBayaranSkbDto();

  idSkb: any;
  agencies: any;
  no_rujukan_kelulusan: string;
  nama_tabung: string;
  nama_bencana: string;
  filter: string;
  saving = false;
  tarikhMula: string;
  tarikhTamat: string;
  rows = [];
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

	skbList = [
		{
      tarikh_mula: '06-01-2020', tarikh_tamat: '16-12-2020', jumlah_siling_peruntukan: '30000.00',
      jumlah_baki_peruntukan: '10000.00', jumlah_perbelanjaan: '20000.00', status_skb: 'Tamat'
		},
		{
      tarikh_mula: '16-12-2020', tarikh_tamat: '25-08-2021', jumlah_siling_peruntukan: '15000.00',
      jumlah_baki_peruntukan: '5000.00', jumlah_perbelanjaan: '10000.00', status_skb: 'Aktif'
		}
	]

	constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private _activatedRoute: ActivatedRoute,
    private _tabungBayaranSkbServiceProxy: TabungBayaranSkbServiceProxy,
    private _refAgensiServiceProxy: RefAgensiServiceProxy,
    private calendar: NgbCalendar,
    private router: Router
  ) {
    this.idSkb = this._activatedRoute.snapshot.queryParams['id'];
    this.primengTableHelper = new PrimengTableHelper();
    this.edit.tabung_bayaran_skb = new CreateOrEditTabungBayaranSkbDto();
    this.edit.rujukan_kelulusan_skb = new GetRujukanKelulusanSkbDto();
    this.edit.nama_tabung = this.nama_tabung;
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
    this.getAgensi();
    this.getBulan();
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
      this.no_rujukan_kelulusan = result.rujukan_kelulusan_skb.no_rujukan_kelulusan;
      this.nama_tabung = result.nama_tabung;
      this.nama_bencana = result.nama_bencana;
      if(result.tabung_bayaran_skb.tarikh_mula){
        this.modelMula = this.fromModel(result.tabung_bayaran_skb.tarikh_mula.format('YYYY-MM-DD'));
      }
      if(result.tabung_bayaran_skb.tarikh_tamat){
        this.modelTamat = this.fromModel(result.tabung_bayaran_skb.tarikh_tamat.format('YYYY-MM-DD'));
      }
    })
  }

  getAgensi(filter?) {
		this._refAgensiServiceProxy.getRefAgensiForDropdown(filter).subscribe((result) => {
			this.agencies = result.items;
		});
	}

	getBulan(event?: LazyLoadEvent) {
		if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this.primengTableHelper.totalRecordsCount = this.skbList.length;
		this.primengTableHelper.records = this.skbList;
		this.primengTableHelper.hideLoadingIndicator();
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
			},
			() => {}
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

  skbBulanan() {
		this.modalService.open(PaparBulananComponent, { size: 'lg' });
  }

	save() {
    this.saving = true;
    this.bayaranSKB.skb = this.edit.tabung_bayaran_skb;
    if(this.modelMula){
      this.tarikhMula = this.toModel(this.modelMula);
      this.bayaranSKB.skb.tarikh_mula = moment(this.tarikhMula, "YYYY-MM-DD");
    }
    if(this.modelTamat){
      this.tarikhTamat = this.toModel(this.modelTamat);
      this.bayaranSKB.skb.tarikh_tamat = moment(this.tarikhTamat, "YYYY-MM-DD");
    }
		this._tabungBayaranSkbServiceProxy
			.createOrEdit(this.bayaranSKB)
			.pipe()
			.subscribe((result) => {
				Swal.fire('Berjaya!', 'Maklumat Surat Kuasa Belanja Berjaya Dikemaskini.', 'success').then(() => {
					this.router.navigateByUrl('/app/tabung/senarai-skb');
				});
			});
	}
}
