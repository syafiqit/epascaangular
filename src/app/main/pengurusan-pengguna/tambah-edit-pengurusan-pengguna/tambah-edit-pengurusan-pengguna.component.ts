import { AfterViewInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { ColumnMode, id, SortType } from '@swimlane/ngx-datatable';
import { ActivatedRoute } from '@angular/router';
import { CreatePenggunaDto, GetUserForEditDto, RefAgensiServiceProxy, RefDaerahServiceProxy, RefKementerianServiceProxy, RefNegeriServiceProxy, UserServiceProxy } from 'src/app/shared/proxy/service-proxies';
declare let require;
const Swal = require('sweetalert2');

@Component({
	selector: 'app-tambah-edit-pengurusan-pengguna',
	templateUrl: './tambah-edit-pengurusan-pengguna.component.html',
	encapsulation: ViewEncapsulation.None
})
export class TambahEditPengurusanPenggunaComponent implements AfterViewInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	active = 1;
  idPengguna: any;
  saving = false;
  show = false;
  showNew = false;
  ulang_kata_laluan: any;
  agensi: any;
  agency: any;
  daerah: any;
  districts: any;
  states: any;
  ministries: any;


	primengTableHelper: PrimengTableHelper;
  pengguna: GetUserForEditDto = new GetUserForEditDto();
  daftar: CreatePenggunaDto = new CreatePenggunaDto();

	rows = [
		{ category: 'Profil Mangsa' },
		{ category: 'Bantuan Wang Ehsan' },
		{ category: 'Bantuan Rumah' },
		{ category: 'Bantuan Pinjaman' },
		{ category: 'Bantuan Pertanian' },
		{ category: 'Bantuan Antarabangsa' },
		{ category: 'Bantuan Lain' },
		{ category: 'Carian' },
		{ category: 'Laporan' }
	];

	ColumnMode = ColumnMode;
	SortType = SortType;

	constructor(
    private _activatedRoute: ActivatedRoute,
    private _userServiceProxy: UserServiceProxy,
    private _refAgensiServiceProxy: RefAgensiServiceProxy,
    private _refDaerahServiceProxy: RefDaerahServiceProxy,
    private _refNegeriServiceProxy: RefNegeriServiceProxy,
    private _refKementerianServiceProxy: RefKementerianServiceProxy,
    ) {
		this.primengTableHelper = new PrimengTableHelper();
    this.idPengguna = this._activatedRoute.snapshot.queryParams['id'];
	}

	ngAfterViewInit(): void {
    this.shows();
    this.getAgensi();
    this.getKementerian();
    this.getDaerah();
    this.getNegeri();
	}

  shows(){
    if (!this.idPengguna) {
			this.pengguna = new GetUserForEditDto();
		} else {
			this._userServiceProxy.getUserForEdit(this.idPengguna).subscribe((result) => {
				this.pengguna = result;
			});
		}
  }

	reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}

  showPassword() {
		this.show = !this.show;
	}

	showNewPassword() {
		this.showNew = !this.showNew;
	}

  getAgensi(filter?) {
		this._refAgensiServiceProxy.getRefAgensiForDropdown(filter).subscribe((result) => {
			this.agency = result.items;
		});
	}

  getDaerah(filter?) {
		this._refDaerahServiceProxy.getRefDaerahForDropdown(filter).subscribe((result) => {
			this.districts = result.items;
		});
	}

  getNegeri(filter?) {
		this._refNegeriServiceProxy.getRefNegeriForDropdown(filter).subscribe((result) => {
			this.states = result.items;
		});
	}

  getKementerian(filter?) {
		this._refKementerianServiceProxy.getRefKementerianForDropdown(filter).subscribe((result) => {
			this.ministries = result.items;
		});
	}

  setAgensi() {
		this.daftar.id_agensi = this.agensi.id;
		this.daftar.id_kementerian = this.agensi.id_kementerian;
	}

  setDaerah() {
    this.daftar.id_daerah = this.daerah.id;
		this.daftar.id_negeri = this.daerah.id_negeri;
  }

  save(){
    this.saving = true;
		if (this.daftar.kata_laluan == this.ulang_kata_laluan) {
      this._userServiceProxy
			.create(this.daftar)
			.pipe()
			.subscribe((result) => {
				Swal.fire('Berjaya!', 'Maklumat Berjaya Didaftarkan.', 'success').then(() => {
					location.href = '/app/pengguna/senarai-pengurusan-pengguna';
				});
			});
    }
    else {
      Swal.fire('', 'Kata Laluan Dan Ulang Kata Laluan Tidak Sepadan ', 'error');
    }
  }

}
