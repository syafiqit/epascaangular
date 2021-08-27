import { Component, OnInit } from '@angular/core';
import { fadeVerticalAnimation } from 'src/app/shared/data/router-animation/fade-vertical-animation';
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
import { AppSessionService } from 'src/app/shared/services/app-session.service';
import { swalError, swalSuccess } from '@shared/sweet-alert/swal-constant';

@Component({
	selector: 'app-pengguna',
	templateUrl: './pengguna.component.html',
  styleUrls: ['./pengguna.component.scss'],
  animations: [fadeVerticalAnimation]
})
export class PenggunaComponent implements OnInit {
  endpoint = '/api/session/uploadGambarProfil';

  getProfile: GetProfilDto = new GetProfilDto();
  updateProfile: UpdateProfilDto = new UpdateProfilDto();

  profilImageChangedEvent = '';
  profilImageTempName = '';
  defaultImageUrl = '/assets/images/user/default.jpg';

  ministries: any;
  agencies: any;
  districts: any;
  states: any;
  negeriAgensi: any;
  daerahAgensi: any;
  kementerian: any;
  agensi: any;
  filterIdNegeri: number;
  showAddress = false;

	constructor(
    private _sessionServiceProxy: SessionServiceProxy,
    private _refKementerianServiceProxy: RefKementerianServiceProxy,
    private _refAgensiServiceProxy: RefAgensiServiceProxy,
    private _refDaerahServiceProxy: RefDaerahServiceProxy,
    private _refNegeriServiceProxy: RefNegeriServiceProxy,
    private _appSession: AppSessionService
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
  }

	show(): void {
		this._sessionServiceProxy.getProfil().subscribe((result) => {
			this.getProfile = result;
      if(result.pengguna.id_peranan == 2) {
        this.showAddress = true;
        this.getDaerah(result.pengguna.id_daerah);
      }
      this.getAgensi(result.pengguna.id_agensi);
		});
	}

	fileChangeEvent(event: any): void {
    if (event.target.files[0].size > 5242880) { //5MB
      swalError.fire({
        title: 'Fail cecah had maksima!',
        icon: 'error',
        text: 'Fail melebihi saiz 5MB',
        showCloseButton: true
      });
      return;
    }

    if (event.target.files[0].type != "image/png" && event.target.files[0].type != "image/jpg" && event.target.files[0].type != "image/jpeg") {
      swalError.fire({
        title: 'Format tidak sesuai!',
        icon: 'error',
        text: 'Format JPG, JPEG dan PNG sahaja diterima',
        showCloseButton: true
      });
      return;
    }

    this.profilImageChangedEvent = event;
      if (event && !event?.target) {
        this.profilImageTempName = this.getFileName(event);
      }
  }

  assignImage(e: string) {
    this.getProfile.pengguna.gambar = e;
    this.profilImageTempName = this.getFileName(e);
  }

  getFileName(url: string) {
    return url.split('/').pop();
  }

  refreshProfil(success: boolean){
    if(success){
      this._appSession.init();
    }
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
		this._refDaerahServiceProxy.getRefDaerahForDropdown(filter, this.filterIdNegeri).subscribe((result) => {
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
			swalSuccess.fire('Berjaya!', 'Maklumat Profil Berjaya Dikemaskini.', 'success').then(() => {
				location.reload();
			});
		});
	}
}
