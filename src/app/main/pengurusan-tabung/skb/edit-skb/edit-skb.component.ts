import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { PilihanRujukanKelulusanComponent } from '../pilihan-rujukan-kelulusan/pilihan-rujukan-kelulusan.component';
import {
  CreateOrEditTabungBayaranSkbDto,
  GetRujukanKelulusanSkbDto,
  GetTabungBayaranSkbForEditDto,
  InputCreateBayaranSkbDto,
  InputSkbBulananDto,
  RefAgensiServiceProxy,
  TabungBayaranSkbBulananServiceProxy,
  TabungBayaranSkbServiceProxy
} from 'src/app/shared/proxy/service-proxies';
import { TambahBelanjaBulanan } from '../tambah-belanja-bulanan/tambah-belanja-bulanan.component';
import * as moment from 'moment';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
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
  bulanan: InputSkbBulananDto[] = [];
  kelulusan: GetRujukanKelulusanSkbDto = new GetRujukanKelulusanSkbDto();

  idSkb: any;
  agencies: any;
  no_rujukan_kelulusan: string;
  nama_tabung: string;
  date = new Date();
  filter: string;
  saving = false;
  tarikhMula: string;
  tarikhTamat: string;
  rows = [];

	constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private _activatedRoute: ActivatedRoute,
    private _tabungBayaranSkbServiceProxy: TabungBayaranSkbServiceProxy,
    private _refAgensiServiceProxy: RefAgensiServiceProxy,
    private _tabungBayaranSkbBulananServiceProxy: TabungBayaranSkbBulananServiceProxy,
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
    this.getAddSKB();
    this.show();
  }

  show() {
    this._tabungBayaranSkbServiceProxy.getTabungBayaranSkbForEdit(this.idSkb).subscribe((result)=>{
      this.edit = result;
      this.edit.tabung_bayaran_skb = result.tabung_bayaran_skb;
      this.no_rujukan_kelulusan = result.rujukan_kelulusan_skb.no_rujukan_kelulusan;
      this.nama_tabung = result.nama_tabung;
      this.tarikhMula = result.tabung_bayaran_skb.tarikh_mula.format('yyyy-MM-DD');
      this.tarikhTamat = result.tabung_bayaran_skb.tarikh_tamat.format('yyyy-MM-DD');
    })
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
		this._tabungBayaranSkbBulananServiceProxy
			.getAllBulananbyIdSkb(
				this.filter,
        this.idSkb,
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

  addBulanan(id_tabung_bayaran_skb) {
		const modalRef = this.modalService.open(TambahBelanjaBulanan, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
    modalRef.componentInstance.kategori = 2;
    modalRef.componentInstance.id_tabung_bayaran_skb = id_tabung_bayaran_skb;
    modalRef.result.then(
			(response) => {
				if (response) {
          this.rows.push({ tahun: response.tahun, bulan: response.bulan, jumlah: response.jumlah });
          this.getAddSKB();
          const monthly = new InputSkbBulananDto();
          monthly.tahun = response.tahun;
          monthly.bulan = response.bulan;
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
    modalRef.result.then(
			(response) => {
				if (response) {
          this.rows.push({ tahun: response.tahun, bulan: response.bulan, jumlah: response.jumlah });
          this.getAddSKB();
          const monthly = new InputSkbBulananDto();
          monthly.tahun = response.tahun;
          monthly.bulan = response.bulan;
          monthly.jumlah = response.jumlah;
          this.bulanan.push(monthly);
				}
			},
			() => {}
		);
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
					this.no_rujukan_kelulusan = response.no_rujukan_kelulusan;
          this.nama_tabung = response.nama_tabung;
          this.skb.id_tabung_kelulusan = response.id;
				}
			},
			() => {}
		);
	}

	save() {
    this.saving = true;
    this.bayaranSKB.skb = this.edit.tabung_bayaran_skb;
    this.bayaranSKB.skb.tarikh_mula = moment(this.tarikhMula);
    this.bayaranSKB.skb.tarikh_tamat = moment(this.tarikhTamat);
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
