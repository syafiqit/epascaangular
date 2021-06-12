import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { PilihanRujukanKelulusanComponent } from '../pilihan-rujukan-kelulusan/pilihan-rujukan-kelulusan.component';
import { ActivatedRoute } from '@angular/router';
import {
  CreateOrEditTabungBayaranSkbDto,
  GetProfilDto,
  GetTabungBayaranSkbForEditDto,
  InputCreateBayaranSkbDto,
  PenggunaProfilDto,
  RefAgensiServiceProxy,
  SessionServiceProxy,
  TabungBayaranSkbBulananServiceProxy,
  TabungBayaranSkbServiceProxy
} from 'src/app/shared/proxy/service-proxies';
import { finalize } from 'rxjs/operators';
declare let require;
const Swal = require('sweetalert2');
@Component({
	selector: 'app-tambah-edit-skb',
	templateUrl: './tambah-edit-skb.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TambahEditSkbComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

  edit: GetTabungBayaranSkbForEditDto = new GetTabungBayaranSkbForEditDto();
  bayarSKB: CreateOrEditTabungBayaranSkbDto = new CreateOrEditTabungBayaranSkbDto();
  bayaranSKB: InputCreateBayaranSkbDto =  new InputCreateBayaranSkbDto();
  getPegawai: GetProfilDto = new GetProfilDto();
  idSkb: any;
  agencies: any;
  agensi: any;
  no_rujukan_kelulusan: number;
  nama_tabung: string;
  date = new Date();
  filter: string;
  saving = false;

	constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private _activatedRoute: ActivatedRoute,
    private _tabungBayaranSkbServiceProxy: TabungBayaranSkbServiceProxy,
    private _refAgensiServiceProxy: RefAgensiServiceProxy,
    private _sessionServiceProxy: SessionServiceProxy,
    private _tabungBayaranSkbBulananServiceProxy: TabungBayaranSkbBulananServiceProxy
  ) {
    this.idSkb = this._activatedRoute.snapshot.queryParams['id'];
    this.edit.tabung_bayaran_skb = new CreateOrEditTabungBayaranSkbDto();
    this.getPegawai = new GetProfilDto();
    this.getPegawai.pengguna = new PenggunaProfilDto();
		this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
    this.shows();
  }

  shows(): void {
    if (!this.idSkb) {
      this._sessionServiceProxy.getProfil().subscribe((result) => {
        this.getPegawai = result;
        this.getAgensi(result.pengguna.id_agensi);
      });
    }
    else {
      this._tabungBayaranSkbServiceProxy.getTabungBayaranSkbForEdit(this.idSkb).subscribe((result) => {
        this.edit = result;
      });
      this._sessionServiceProxy.getProfil().subscribe((result) => {
        this.getPegawai = result;
        this.getAgensi(result.pengguna.id_agensi);
      });
    }
  }

  getAgensi(idAgensi, filter?) {
		this._refAgensiServiceProxy.getRefAgensiForDropdown(filter).subscribe((result) => {
			this.agencies = result.items;
      this.agensi = this.agencies.find((data)=>{
        return data.id == idAgensi;
      })
      return this.agensi.nama_agensi;
		});
	}

	getAddSKB(event?: LazyLoadEvent) {
		if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this._tabungBayaranSkbBulananServiceProxy
			.getAll(
				this.filter,
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
          this.bayarSKB.id_tabung_kelulusan = response.id;
				}
			},
			() => {}
		);
	}

	save() {
    this.saving = true;
    this.bayarSKB = this.edit.tabung_bayaran_skb;
    this.getPegawai.pengguna.id = this.bayarSKB.id_pegawai;
		this._tabungBayaranSkbServiceProxy
			.createOrEdit(this.bayaranSKB)
			.pipe()
			.subscribe((result) => {
				Swal.fire('Berjaya!', 'Maklumat Berjaya Disimpan.', 'success').then(() => {
					location.href = '/app/tabung/senarai-skb';
				});
			});
	}
}
