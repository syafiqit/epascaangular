import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ChangeEmelPasswordDto,
  CreateOrEditPenggunaDto,
  EditUserDto,
  GetUserForEditDto,
  OutputChangeEmelPasswordDto,
  RefAgensiServiceProxy,
  RefDaerahServiceProxy,
  RefKementerianServiceProxy,
  RefNegeriServiceProxy,
  UserServiceProxy
} from 'src/app/shared/proxy/service-proxies';
import { finalize } from 'rxjs/operators';
import { NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { fadeVerticalAnimation } from 'src/app/shared/data/router-animation/fade-vertical-animation';
declare let require;
const Swal = require('sweetalert2');

@Component({
	selector: 'app-tambah-edit-pengurusan-pengguna',
	templateUrl: './tambah-edit-pengurusan-pengguna.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig],
  animations: [fadeVerticalAnimation]
})
export class TambahEditPengurusanPenggunaComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	active;
  idPengguna: any;
  statusId: any;
  saving = false;
  agensi: any;
  agency: any;
  daerah: any;
  districts: any;
  states: any;
  ministries: any;
  filterIdNegeri: number;
  viewTab = false;
  inputEmail = false;

  new_email: string;
  new_password: string;
  repeat_new_password: string;
	public showNew = false;
	public showRepeatNew = false;

	primengTableHelper: PrimengTableHelper;
  edit: GetUserForEditDto = new GetUserForEditDto();
  daftar: CreateOrEditPenggunaDto = new CreateOrEditPenggunaDto();
  editEmailPassword: ChangeEmelPasswordDto = new ChangeEmelPasswordDto();
  outputEmailPassword: OutputChangeEmelPasswordDto = new OutputChangeEmelPasswordDto();
  passwordPattern="^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
  emailPattern = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}";

  statusPengesahan = [
    { id: 1, nama: "Permohonan" },
    { id: 2, nama: "Berdaftar" },
    { id: 4, nama: "Ditolak" }
  ]

  statusBerdaftar = [
    { id: 2, nama: "Berdaftar" },
    { id: 3, nama: "Tidak Aktif" }
  ]

  statusDitolak = [
    { id: 4, nama: "Ditolak" },
    { id: 2, nama: "Berdaftar" }
  ]

	constructor(
    config: NgbModalConfig,
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

	ngOnInit(): void {
    this.shows();
	}

  shows(){
    if (!this.idPengguna) {
      this.inputEmail = true;
      this.getKementerian();
      this.getAgensiForCreate();
      this.getDaerahForCreate();
      this.getNegeri();
		} else {
			this._userServiceProxy.getUserForEdit(this.idPengguna).subscribe((result) => {
				this.edit = result;
        this.statusId = result.pengguna.status_pengguna;
        if(result.pengguna.status_pengguna != 1) {
          this.viewTab = true;
        }
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

	showNewPassword() {
		this.showNew = !this.showNew;
	}

	showRepeatNewPassword() {
		this.showRepeatNew = !this.showRepeatNew;
	}

  preSave() {
    if(this.edit.pengguna.status_pengguna == 1) {
      this.savePermohonan();
    }
    if(this.edit.pengguna.status_pengguna != 1) {
      this.save();
    }
  }

  save() {
		this.saving = true;
    this.daftar.pengguna = this.edit.pengguna;
		this._userServiceProxy
			.createOrEdit(this.daftar)
			.pipe()
			.subscribe((result) => {
				Swal.fire('Berjaya!', 'Maklumat Pengguna Berjaya Dikemaskini.', 'success').then(() => {
					this.router.navigateByUrl('/app/pengguna/senarai');
				});
			});
	}

  savePermohonan() {
		this.saving = true;
    this.daftar.pengguna = this.edit.pengguna;
		this._userServiceProxy
			.createOrEdit(this.daftar)
			.pipe()
			.subscribe((result) => {
				Swal.fire('Berjaya!', 'Maklumat Pengguna Berjaya Dikemaskini.', 'success').then(() => {
					this.router.navigateByUrl('/app/pengguna/permohonan');
				});
			});
	}

  saveEmelPassword() {
		this.saving = true;
    this.editEmailPassword.id = this.idPengguna;
    this.editEmailPassword.changeEmel = this.new_email ?? null;
    this.editEmailPassword.changePassword = this.new_password ?? null;

    if(this.new_password == this.repeat_new_password) {
      this._userServiceProxy
      .changeEmelAndPassword(this.editEmailPassword)
      .pipe(finalize(() => {this.saving = false;})).subscribe((result) => {
        this.outputEmailPassword = result;
        if(this.outputEmailPassword.message == "Emel atau Kata Laluan Berjaya Ditukar") {
          Swal.fire('Berjaya!', this.outputEmailPassword.message, 'success').then(() => {
            this.router.navigateByUrl('/app/pengguna/senarai');
          });
        }else{
          Swal.fire('Tidak Berjaya!', this.outputEmailPassword.message, 'error');
        }
			});
    } else {
			Swal.fire('Tidak Berjaya!', 'Kata Laluan Baru Dan Ulang Kata Laluan Tidak Sepadan ', 'error');
		}
  }

}
