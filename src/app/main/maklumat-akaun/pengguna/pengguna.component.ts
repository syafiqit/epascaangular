import { Component, OnInit } from '@angular/core';
import { fadeVerticalAnimation } from 'src/app/shared/data/router-animation/fade-vertical-animation';
import {
  GetProfilDto,
  OutputProfilDto,
  PenggunaProfilDto,
  RefAgensiServiceProxy,
  RefDaerahServiceProxy,
  RefKementerianServiceProxy,
  RefNegeriServiceProxy,
  SessionServiceProxy,
  UpdateProfilDto
} from 'src/app/shared/proxy/service-proxies';
import { AppSessionService } from 'src/app/shared/services/app-session.service';
import { ConfirmationService } from '@services/confirmation';

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
  output: OutputProfilDto = new OutputProfilDto();

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
    private _appSession: AppSessionService,
    private _confirmationService: ConfirmationService
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
      if(result.pengguna.id_peranan === 2) {
        this.showAddress = true;
        this.getDaerah(result.pengguna.id_daerah);
      }
      this.getAgensi(result.pengguna.id_agensi);
		});
	}

	fileChangeEvent(event: any): void {
    if (event.target.files[0].size > 5242880) { //5MB
      this._confirmationService.open({
        title: 'Fail cecah had maksima!',
        message: 'Fail melebihi saiz 5MB.',
        icon: {
          show: true,
          name: 'alert-triangle',
          color: 'error'
        },
        actions: {
          confirm: {
            show: true,
            label: 'Tutup',
            color: 'warn'
          },
          cancel: {
            show: false
          }
        },
        dismissible: true
      });
    }

    if (event.target.files[0].type !== 'image/png' && event.target.files[0].type !== 'image/jpg' && event.target.files[0].type !== 'image/jpeg') {
      this._confirmationService.open({
        title: 'Format tidak sah!',
        message: 'Hanya format JPG, JPEG dan PNG sahaja dibenarkan',
        icon: {
          show: true,
          name: 'alert-triangle',
          color: 'error'
        },
        actions: {
          confirm: {
            show: true,
            label: 'Tutup',
            color: 'warn'
          },
          cancel: {
            show: false
          }
        },
        dismissible: true
      });
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
      this.agensi = this.agencies.find(data=>data.id === idAgensi);
      return this.agensi.nama_agensi;
		});
	}

  getDaerah(idDaerah, filter?) {
		this._refDaerahServiceProxy.getRefDaerahForDropdown(filter, this.filterIdNegeri).subscribe((result) => {
			this.districts = result.items;
      this.daerahAgensi = this.districts.find(data=>data.id === idDaerah);
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
      this.output = result;
      if(this.output.message == "Maklumat profil telah dikemaskini."){
        const dialogRef = this._confirmationService.open({
          title: 'Berjaya',
          message: 'Maklumat Profil Berjaya Dikemaskini.',
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
          message: this.output.message,
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
        dialogRef.afterClosed().subscribe(() => {
          this.show();
        });
      }
		});
	}
}
