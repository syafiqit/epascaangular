/* eslint-disable @typescript-eslint/naming-convention */
import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
  RefPerananServiceProxy,
  UserServiceProxy
} from 'src/app/shared/proxy/service-proxies';
import { finalize } from 'rxjs/operators';
import { NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { fadeVerticalAnimation } from 'src/app/shared/data/router-animation/fade-vertical-animation';
import { PerananTreeComponent } from '@app/shared/components/peranan-tree/peranan-tree.component';
import { ConfirmationService } from '@app/shared/services/confirmation';

@Component({
	selector: 'app-tambah-edit-pengurusan-pengguna',
	templateUrl: './tambah-edit-pengurusan-pengguna.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig],
  animations: [fadeVerticalAnimation]
})
export class TambahEditPengurusanPenggunaComponent implements OnInit {
  @Input() singleSelect: boolean;

	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;
  @ViewChild('permissionTree') permissionTree: PerananTreeComponent;

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
  agensiNadma = true;
  idAgensi: number = 6;
  idKementerian: number = 1;

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
  passwordPattern='^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$';
  emailPattern = '[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}';

  statusPengesahan = [
    { id: 1, nama: 'Permohonan' },
    { id: 2, nama: 'Berdaftar' },
    { id: 4, nama: 'Ditolak' }
  ];

  statusBerdaftar = [
    { id: 2, nama: 'Berdaftar' },
    { id: 3, nama: 'Tidak Aktif' }
  ];

  statusDitolak = [
    { id: 4, nama: 'Ditolak' },
    { id: 2, nama: 'Berdaftar' }
  ];

  tambahPeranan = [
    { id: 1, nama_peranan: 'Admin Sekretariat' },
    { id: 3, nama_peranan: 'Penyelia' },
    { id: 4, nama_peranan: 'Sekretariat' },
    { id: 5, nama_peranan: 'Kewangan' }
  ];

  viewPeranan = [
    { id: 1, nama_peranan: 'Admin Sekretariat' },
    { id: 2, nama_peranan: 'Agensi/Jabatan' },
    { id: 3, nama_peranan: 'Penyelia' },
    { id: 4, nama_peranan: 'Sekretariat' },
    { id: 5, nama_peranan: 'Kewangan' }
  ];

	constructor(
    private _activatedRoute: ActivatedRoute,
    private _userServiceProxy: UserServiceProxy,
    private _refAgensiServiceProxy: RefAgensiServiceProxy,
    private _refDaerahServiceProxy: RefDaerahServiceProxy,
    private _refNegeriServiceProxy: RefNegeriServiceProxy,
    private _refKementerianServiceProxy: RefKementerianServiceProxy,
    private _refPerananServiceProxy: RefPerananServiceProxy,
    private _confirmationService: ConfirmationService,
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
      this.agensiNadma = true;
		} else {
			this._userServiceProxy.getUserForEdit(this.idPengguna).subscribe((result) => {
				this.edit = result;
        this.statusId = result.pengguna.status_pengguna;
        if(result.pengguna.status_pengguna !== 1) {
          this.viewTab = true;
        }
        if(result.pengguna.id_peranan === 2) {
          this.agensiNadma = false;
        }
        this.getAgensi(result.pengguna.id_agensi ?? undefined);
        this.getKementerian();
        this.getDaerah(result.pengguna.id_daerah ?? undefined);
        this.getNegeri();
        this.loadAllPermissionsToFilterTree(result.capaian_dibenarkan);
			});
		}
  }

	reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}

  getAgensi(idAgensi, filter?) {
		this._refAgensiServiceProxy.getRefAgensiForDropdown(filter).subscribe((result) => {
			this.agency = result.items;
      this.agensi = this.agency.find(data=>data.id === idAgensi);
      return this.agensi.nama_agensi;
		});
	}

  getDaerah(idDaerah, filter?) {
      this._refDaerahServiceProxy.getRefDaerahForDropdown(filter, this.filterIdNegeri ?? undefined).subscribe((result) => {
			this.districts = result.items;
      if(this.edit.pengguna.id_peranan === 2) {
        this.daerah = this.districts.find(data=>data.id === idDaerah);
          return this.daerah.nama_daerah;
      }
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

  save() {
    const self = this;
		this.saving = true;
    const input = new CreateOrEditPenggunaDto();
    input.pengguna = self.edit.pengguna;
    if(input.pengguna.id_peranan !== 2) {
      input.pengguna.id_agensi = self.idAgensi;
      input.pengguna.id_kementerian = self.idKementerian;
    }
		if(!this.idPengguna) {
      this._userServiceProxy
			.createOrEdit(input)
			.pipe()
			.subscribe((result) => {
        this.outputEmailPassword = result;
        if(this.outputEmailPassword.message == "Pendaftaran Pengguna Berjaya!"){
          const dialogRef = this._confirmationService.open({
            title: 'Berjaya',
            message: 'Pengguna Baru Berjaya Didaftarkan',
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
            this.router.navigateByUrl('/app/pengguna/senarai');
          });
        }else{
          const dialogRef = this._confirmationService.open({
            title: 'Tidak Berjaya',
            message: this.outputEmailPassword.message,
            icon: {
              show: true,
              name: 'x-circle',
              color: 'error'
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
        }
			});
    } else {
      input.capaian_dibenarkan = self.permissionTree.getGrantedPermissionNames();
      this._userServiceProxy
			.createOrEdit(input)
			.pipe()
			.subscribe((result) => {
        this.outputEmailPassword = result;
        if(this.outputEmailPassword.message == "Data telah dikemaskini"){
          const dialogRef = this._confirmationService.open({
            title: 'Berjaya',
            message: 'Maklumat Pengguna Berjaya Dikemaskini',
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
            if(input.pengguna.status_pengguna == 1) {
              this.router.navigateByUrl('/app/pengguna/permohonan');
            } else {
              this.router.navigateByUrl('/app/pengguna/senarai');
            }
          });
        }
			});
    }
	}

  saveEmelPassword() {
		this.saving = true;
    this.editEmailPassword.id = this.idPengguna;
    this.editEmailPassword.changeEmel = this.new_email ?? null;
    this.editEmailPassword.changePassword = this.new_password ?? null;

    if(this.new_password === this.repeat_new_password) {
      this._userServiceProxy
      .changeEmelAndPassword(this.editEmailPassword)
      .pipe(finalize(() => {this.saving = false;})).subscribe((result) => {
        this.outputEmailPassword = result;
        if(this.outputEmailPassword.message === 'Emel atau Kata Laluan Berjaya Ditukar') {
          const dialogRef = this._confirmationService.open({
            title: 'Berjaya',
            message: this.outputEmailPassword.message,
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
            location.reload();
          });
        }else{
          const dialogRef = this._confirmationService.open({
            title: 'Tidak Berjaya',
            message: this.outputEmailPassword.message,
            icon: {
              show: true,
              name: 'x-circle',
              color: 'error'
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
        }
			});
    } else {
      const dialogRef = this._confirmationService.open({
        title: 'Tidak Berjaya',
        message: 'Kata Laluan Baru Dan Ulang Kata Laluan Tidak Sepadan',
        icon: {
          show: true,
          name: 'x-circle',
          color: 'error'
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
		}
  }

  loadAllPermissionsToFilterTree(grantedPermissions?) {
    this._refPerananServiceProxy.getAllRefCapaian().subscribe((result) => {
        this.permissionTree.editData = { ref_capaian:  result.ref_capaian, capaian: grantedPermissions};
    });
  }

}
