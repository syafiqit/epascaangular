import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AuthServiceProxy,
  OutputLoginDto,
  RefAgensiServiceProxy,
  RefDaerahServiceProxy,
  RefKementerianServiceProxy,
  RefNegeriServiceProxy,
  RefPerananServiceProxy,
  RegisterPenggunaDto
} from 'src/app/shared/proxy/service-proxies';
import { swalError, swalSuccess } from '@shared/sweet-alert/swal-constant';

@Component({
	selector: 'app-daftar-akaun',
	templateUrl: './daftar-akaun.component.html'
})

export class DaftarAkaunComponent implements OnInit {

 	register: RegisterPenggunaDto = new RegisterPenggunaDto();
  output: OutputLoginDto = new OutputLoginDto();
  emailPattern = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}";
  roles: any;
  agency: any;
  ministries: any;
  districts: any;
  states: any;
	saving = false;
  agensi: any;
  daerah: any;
  filterIdNegeri: number;

	constructor(
		private _authServiceProxy: AuthServiceProxy,
    private _refPerananServiceProxy: RefPerananServiceProxy,
    private _refAgensiServiceProxy: RefAgensiServiceProxy,
    private _refKementerianServiceProxy: RefKementerianServiceProxy,
    private _refDaerahServiceProxy: RefDaerahServiceProxy,
    private _refNegeriServiceProxy: RefNegeriServiceProxy,
    private _router: Router
	) {}

	ngOnInit(): void {
    this.getPeranan();
    this.getAgensi();
    this.getKementerian();
    this.getDaerah();
    this.getNegeri();
  }

  reset(){
    this.register = new RegisterPenggunaDto();
  }

  getPeranan(filter?) {
		this._refPerananServiceProxy.getRefPerananForDropdown(filter).subscribe((result) => {
			this.roles = result.items;
		});
	}

  getAgensi(filter?) {
		this._refAgensiServiceProxy.getRefAgensiForDropdown(filter).subscribe((result) => {
			this.agency = result.items;
		});
	}

  getKementerian(filter?) {
		this._refKementerianServiceProxy.getRefKementerianForDropdown(filter).subscribe((result) => {
			this.ministries = result.items;
		});
	}

  getDaerah(filter?) {
		this._refDaerahServiceProxy.getRefDaerahForDropdown(filter, this.filterIdNegeri).subscribe((result) => {
			this.districts = result.items;
		});
	}

  getNegeri(filter?) {
		this._refNegeriServiceProxy.getRefNegeriForDropdown(filter).subscribe((result) => {
			this.states = result.items;
		});
	}

	setAgensi() {
		this.register.id_agensi = this.agensi.id;
		this.register.id_kementerian = this.agensi.id_kementerian;
	}

  setDaerah() {
    this.register.id_daerah = this.daerah.id;
		this.register.id_negeri = this.daerah.id_negeri;
  }

	save() {
		this.saving = true;
		this._authServiceProxy
			.registerUser(this.register)
			.pipe()
			.subscribe((result) => {
        this.output = result;
        if(this.output.message == "Pendaftaran Pengguna Berjaya!"){
          swalSuccess.fire('Berjaya!', 'Maklumat Pengguna Berjaya Didaftarkan.', 'success').then(() => {
            this._router.navigateByUrl('akaun/log-masuk');
          });
        }else{
          swalError.fire('Tidak Berjaya!', this.output.message, 'error');
        }
			});
	}
}
