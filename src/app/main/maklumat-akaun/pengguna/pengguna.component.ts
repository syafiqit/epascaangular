import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  GetProfilDto,
  PenggunaProfilDto,
  RefAgensiServiceProxy,
  RefDaerahServiceProxy,
  RefKementerianServiceProxy,
  RefNegeriServiceProxy,
  SessionServiceProxy,
  UpdateProfilDto
} from 'src/app/shared/proxy/service-proxies';
import { environment } from 'src/environments/environment';
declare let require;
const Swal = require('sweetalert2');

@Component({
	selector: 'app-pengguna',
	templateUrl: './pengguna.component.html',
	styles: ['ngx-dropzone{ height: 50px; width: 200px }','img{ height: 100%; width: 100%; }']
})
export class PenggunaComponent implements OnInit {

  getProfile: GetProfilDto = new GetProfilDto();
  updateProfile: UpdateProfilDto = new UpdateProfilDto();

  secondFormGroup: FormGroup;
	files: File[] = [];
	hasImage: number;
  url: string;
	serverUrl = environment.apiUrl + '/api/session/uploadGambarProfil';

  ministries: any;
  agencies: any;
  districts: any;
  states: any;
  negeriAgensi: any;
  daerahAgensi: any;
  kementerian: any;
  agensi: any;

	constructor(
    private _sessionServiceProxy: SessionServiceProxy,
    private _refKementerianServiceProxy: RefKementerianServiceProxy,
    private _refAgensiServiceProxy: RefAgensiServiceProxy,
    private _refDaerahServiceProxy: RefDaerahServiceProxy,
    private _refNegeriServiceProxy: RefNegeriServiceProxy,
    private _formBuilder: FormBuilder,
    private httpClient: HttpClient
  ) {
    this.getProfile = new GetProfilDto();
    this.getProfile.pengguna = new PenggunaProfilDto();
    this.updateProfile = new UpdateProfilDto();
    this.updateProfile.pengguna = new PenggunaProfilDto();
  }

	ngOnInit(): void {
    this.show();
    this.getKementerian();
    this.getNegeri();
		this.secondFormGroup = this._formBuilder.group({
			profile: ['']
		});
  }

	show(): void {
		this._sessionServiceProxy.getProfil().subscribe((result) => {
			this.getProfile = result;
      this.getAgensi(result.pengguna.id_agensi);
      this.getDaerah(result.pengguna.id_daerah);
		});
	}

	onSelect(event) {
		this.files.push(...event.addedFiles);

		const image = this.files[0];
		this.secondFormGroup.get('profile').setValue(image);
		this.hasImage = 1;
	}

  getKementerian(filter?) {
		this._refKementerianServiceProxy.getRefKementerianForDropdown(filter).subscribe((result) => {
			this.ministries = result.items;
		});
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

  getDaerah(idDaerah, filter?) {
		this._refDaerahServiceProxy.getRefDaerahForDropdown(filter).subscribe((result) => {
			this.districts = result.items;
      this.daerahAgensi = this.districts.find((data)=>{
        return data.id == idDaerah;
      })
      return this.daerahAgensi.nama_daerah;
		});
	}

  getNegeri(filter?) {
		this._refNegeriServiceProxy.getRefNegeriForDropdown(filter).subscribe((result) => {
			this.states = result.items;
		});
	}

	setKementerian() {
		this.getProfile.pengguna.id_agensi = this.agensi.id;
		this.getProfile.pengguna.id_kementerian = this.agensi.id_kementerian;
	}

  setNegeri() {
		this.getProfile.pengguna.id_daerah = this.daerahAgensi.id;
		this.getProfile.pengguna.id_negeri = this.daerahAgensi.id_negeri;
  }

	save() {
    this.updateProfile.pengguna = this.getProfile.pengguna;
		this._sessionServiceProxy.updateProfil(this.updateProfile).subscribe((result) => {
			Swal.fire('Berjaya!', 'Maklumat Profil Berjaya Dikemaskini.', 'success').then(() => {
				location.reload();
			});
		});
    const formData = new FormData();
		if (this.files.length > 0) {
			formData.append('image', this.secondFormGroup.get('profile').value);

			this.httpClient.post<any>(this.serverUrl, formData).subscribe(
				(res) => (this.url = res.url)
			);
		}
	}
}
