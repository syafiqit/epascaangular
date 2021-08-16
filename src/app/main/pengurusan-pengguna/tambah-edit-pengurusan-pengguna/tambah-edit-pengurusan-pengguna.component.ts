import { AfterViewInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { ColumnMode, id, SortType } from '@swimlane/ngx-datatable';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CreateOrEditPenggunaDto,
  CreatePenggunaDto,
  EditUserDto,
  GetUserForEditDto,
  RefAgensiServiceProxy,
  RefDaerahServiceProxy,
  RefKementerianServiceProxy,
  RefNegeriServiceProxy,
  UserServiceProxy
} from 'src/app/shared/proxy/service-proxies';
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
  filterIdNegeri: number;


	primengTableHelper: PrimengTableHelper;
  edit: GetUserForEditDto = new GetUserForEditDto();
  daftar: CreateOrEditPenggunaDto = new CreateOrEditPenggunaDto();

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
    private router: Router
    ) {
		this.primengTableHelper = new PrimengTableHelper();
    this.idPengguna = this._activatedRoute.snapshot.queryParams['id'];
    this.edit.pengguna = new EditUserDto();
	}

	ngAfterViewInit(): void {
    this.shows();
	}

  shows(){
    if (!this.idPengguna) {
        this.getKementerian();
        this.getAgensiForCreate();
        this.getDaerahForCreate();
        this.getNegeri();
		} else {
			this._userServiceProxy.getUserForEdit(this.idPengguna).subscribe((result) => {
				this.edit = result;
        this.getAgensiForEdit(result.pengguna.id_kementerian);
        this.getKementerian();
        this.getDaerahForEdit(result.pengguna.id_daerah);
        this.getNegeri();
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

  getAgensiForEdit(idAgensi, filter?) {
		this._refAgensiServiceProxy.getRefAgensiForDropdown(filter).subscribe((result) => {
			this.agency = result.items;
      this.agensi = this.agency.find((data)=>{
        return data.id == idAgensi;
      })
      return this.agensi.nama_agensi;
		});
	}

  getAgensiForCreate(filter?) {
		this._refAgensiServiceProxy.getRefAgensiForDropdown(filter).subscribe((result) => {
			this.agency = result.items;
		});
	}

  getDaerahForEdit(idDaerah, filter?) {
      this._refDaerahServiceProxy.getRefDaerahForDropdown(filter, this.filterIdNegeri).subscribe((result) => {
			this.districts = result.items;
      this.daerah = this.districts.find((data)=>{
        return data.id == idDaerah;
      })
        return this.daerah.nama_daerah;
		  });
	}

  getDaerahForCreate(filter?) {
      this._refDaerahServiceProxy.getRefDaerahForDropdown(filter, this.filterIdNegeri).subscribe((result) => {
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
		this.edit.pengguna.id_agensi = this.agensi.id;
		this.edit.pengguna.id_kementerian = this.agensi.id_kementerian;
	}

  setDaerah() {
    this.edit.pengguna.id_daerah = this.daerah.id;
		this.edit.pengguna.id_negeri = this.daerah.id_negeri;
  }

  reset() {
    this.edit = new GetUserForEditDto();
    this.edit.pengguna = new EditUserDto();
    this.agensi = undefined;
    this.daerah = undefined;
  }

  save() {
		this.saving = true;
    this.daftar.pengguna = this.edit.pengguna;
		this._userServiceProxy
			.createOrEdit(this.daftar)
			.pipe()
			.subscribe((result) => {
				Swal.fire('Berjaya!', 'Maklumat Berjaya Dikemaskini.', 'success').then(() => {
					this.router.navigateByUrl('/app/pengguna/senarai-pengurusan-pengguna');
				});
			});
	  }

}
