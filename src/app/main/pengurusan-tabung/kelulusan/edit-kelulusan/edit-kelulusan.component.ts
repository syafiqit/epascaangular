import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbCalendar, NgbDateStruct, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import {
  CreateOrEditTabungKelulusanDto, RefBantuanServiceProxy, RefBencanaServiceProxy,
  TabungKelulusanServiceProxy, TabungServiceProxy
} from "../../../../shared/proxy/service-proxies";
import {finalize} from "rxjs/operators";
import * as moment from "moment";
import {ActivatedRoute, Router} from "@angular/router";
import { TambahRujukanBencanaComponent } from '../tambah-kelulusan/tambah-rujukan-bencana/tambah-rujukan-bencana.component';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
declare let require;
const Swal = require('sweetalert2');

@Component({
	selector: 'app-edit-kelulusan',
	templateUrl: './edit-kelulusan.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class EditKelulusanComponent implements OnInit {

  @ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;
  @ViewChild('dataTableTerus', { static: true }) dataTableTerus: Table;
	@ViewChild('paginatorTerus', { static: true }) paginatorTerus: Paginator;
  @ViewChild('dataTableTabung', { static: true }) dataTableTabung: Table;
	@ViewChild('paginatorTabung', { static: true }) paginatorTabung: Paginator;
  @ViewChild('dataTableBwi', { static: true }) dataTableBwi: Table;
	@ViewChild('paginatorBwi', { static: true }) paginatorBwi: Paginator;

	primengTableHelper: PrimengTableHelper;
  primengTableHelperTerus: PrimengTableHelper;
  primengTableHelperTabung: PrimengTableHelper;
  primengTableHelperBwi: PrimengTableHelper;

	displayMonths = 1;
	navigation = 'select';
	showWeekNumbers = false;
	outsideDays = 'visible';
  saving = true;
  tarikhSurat:string;
  tarikhMula:string;
  tarikhTamat:string;
  id:number;
  tabung:any;
  bencana:any;
  bantuan:any;

  date = new Date();
  modelSurat: NgbDateStruct;
  modelMula: NgbDateStruct;
  modelTamat: NgbDateStruct;
  today = this.calendar.getToday();
  readonly DELIMITER = '-';

  kelulusan: CreateOrEditTabungKelulusanDto = new CreateOrEditTabungKelulusanDto();

  komitmen = [
    { id: 1, nama_komitmen: "Perolehan Secara Pembelian Terus" },
    { id: 2, nama_komitmen: "Perolehan Secara Darurat" }
  ]

  rowSKB = [
		{
      bil: '1', no_rujukan_skb: 'JPM.APBN(S).600-3/8/2 (1)', tabung: 'Covid-19', jumlah: 'RM 20 982'
		},
		{
      bil: '2', no_rujukan_skb: 'JPM.APBN(S).600-3/8/2 (2)', tabung: 'Banjir', jumlah: 'RM 11 152'
		},
	];

  rowTerus = [
		{
      bil: '1', no_rujukan_terus: 'JPM.APBN(S).500-3/8/2 (1)', tabung: 'Covid-19', jumlah: 'RM 20 982'
		},
		{
      bil: '2', no_rujukan_terus: 'JPM.APBN(S).500-3/8/2 (2)', tabung: 'Banjir', jumlah: 'RM 11 152'
		},
	];

  rowTabung = [
		{
      bil: '1', tabung: 'Covid-19', jumlah: 'RM 41 164'
		},
		{
      bil: '2', tabung: 'Banjir', jumlah: 'RM 22 304'
		},
	];

  rowBwi = [
		{
      bil: '1', no_rujukan: 'Covid-19', negeri: 'Penang', daerah:'SPT', jenis_bencana:'Banjir',tahun:'2020',
      w_kir:'500', jumlah_kir:'500', jumlah:'76', tarikh_eft:'21/2/2020'
		},
    {
      bil: '1', no_rujukan: 'Covid-19', negeri: 'Penang', daerah:'SPT', jenis_bencana:'Banjir',tahun:'2020',
      w_kir:'500', jumlah_kir:'700', jumlah:'76', tarikh_eft:'21/2/2020'
		}
	];

	constructor(
	  config: NgbModalConfig,
    private modalService: NgbModal,
    private router: Router,
    private _activatedRoute: ActivatedRoute,
    private _tabungKelulusanServiceProxy: TabungKelulusanServiceProxy,
    private _tabungServiceProxy: TabungServiceProxy,
    private _refBencanaServiceProxy: RefBencanaServiceProxy,
    private _refBantuanServiceProxy: RefBantuanServiceProxy,
    private calendar: NgbCalendar
  ) {
    this.id = this._activatedRoute.snapshot.queryParams['id'];
		config.backdrop = 'static';
		config.keyboard = false;
    this.primengTableHelper = new PrimengTableHelper();
    this.primengTableHelperTerus = new PrimengTableHelper();
    this.primengTableHelperTabung = new PrimengTableHelper();
    this.primengTableHelperBwi = new PrimengTableHelper();
	}

	ngOnInit(): void {
    this.show();
    this.getTabung();
    this.getBencana();
    this.getBantuan();
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
    if (!this.id) {
      this.kelulusan = new CreateOrEditTabungKelulusanDto();
    } else {
      this._tabungKelulusanServiceProxy.getTabungKelulusanForEdit(this.id).subscribe((result) => {
        this.kelulusan = result.tabung_kelulusan;
        if(result.tabung_kelulusan.tarikh_surat){
          this.modelSurat = this.fromModel(result.tabung_kelulusan.tarikh_surat.format('YYYY-MM-DD'));
        }
        if(result.tabung_kelulusan.tarikh_mula_kelulusan){
          this.modelMula = this.fromModel(result.tabung_kelulusan.tarikh_mula_kelulusan.format('YYYY-MM-DD'));
        }
        if(result.tabung_kelulusan.tarikh_tamat_kelulusan){
          this.modelTamat = this.fromModel(result.tabung_kelulusan.tarikh_tamat_kelulusan.format('YYYY-MM-DD'));
        }
      });
    }
  }

	approvalAddModal() {
		this.modalService.open(TambahRujukanBencanaComponent, { size: 'lg' });
	}

  getTabung(filter?) {
    this._tabungServiceProxy.getTabungForDropdown(filter).subscribe((result) => {
      this.tabung = result.items;
    });
  }

  getBencana(filter?) {
    this._refBencanaServiceProxy.getRefBencanaForDropdown(filter).subscribe((result) => {
      this.bencana = result.items;
    });
  }

  getBantuan(filter?) {
    this._refBantuanServiceProxy.getRefBantuanForDropdown(filter).subscribe((result) => {
      this.bantuan = result.items;
    });
  }

  save(): void {
    this.saving = true;
    if(this.modelSurat){
      this.tarikhSurat = this.toModel(this.modelSurat);
      this.kelulusan.tarikh_surat = moment(this.tarikhSurat, "YYYY-MM-DD");
    }
    if(this.modelMula){
      this.tarikhMula = this.toModel(this.modelMula);
      this.kelulusan.tarikh_mula_kelulusan = moment(this.tarikhMula, "YYYY-MM-DD");
    }
    if(this.modelTamat){
      this.tarikhTamat = this.toModel(this.modelTamat);
      this.kelulusan.tarikh_tamat_kelulusan = moment(this.tarikhTamat, "YYYY-MM-DD");
    }
    this._tabungKelulusanServiceProxy
      .createOrEdit(this.kelulusan)
      .pipe()
      .subscribe(() => {
        Swal.fire('Berjaya!', 'Maklumat Tabung Kelulusan Berjaya Disimpan.', 'success');
        this.router.navigate(['/app/tabung/senarai-kelulusan']);
      });
  }

  getSKBSemasa(event?: LazyLoadEvent) {
		if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this.primengTableHelper.totalRecordsCount = this.rowSKB.length;
		this.primengTableHelper.records = this.rowSKB;
		this.primengTableHelper.hideLoadingIndicator();
	}

  getBelanjaTerus(event?: LazyLoadEvent) {
		if (this.primengTableHelperTerus.shouldResetPaging(event)) {
			this.paginatorTerus.changePage(0);
			return;
		}

		this.primengTableHelperTerus.showLoadingIndicator();
		this.primengTableHelperTerus.totalRecordsCount = this.rowTerus.length;
		this.primengTableHelperTerus.records = this.rowTerus;
		this.primengTableHelperTerus.hideLoadingIndicator();
	}

  getBelanjaTabung(event?: LazyLoadEvent) {
		if (this.primengTableHelperTabung.shouldResetPaging(event)) {
			this.paginatorTerus.changePage(0);
			return;
		}

		this.primengTableHelperTabung.showLoadingIndicator();
		this.primengTableHelperTabung.totalRecordsCount = this.rowTabung.length;
		this.primengTableHelperTabung.records = this.rowTabung;
		this.primengTableHelperTabung.hideLoadingIndicator();
	}

  getSejarahBwi(event?: LazyLoadEvent) {
		if (this.primengTableHelperTabung.shouldResetPaging(event)) {
			this.paginatorBwi.changePage(0);
			return;
		}

		this.primengTableHelperBwi.showLoadingIndicator();
		this.primengTableHelperBwi.totalRecordsCount = this.rowBwi.length;
		this.primengTableHelperBwi.records = this.rowBwi;
		this.primengTableHelperBwi.hideLoadingIndicator();
	}

	reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}
}
