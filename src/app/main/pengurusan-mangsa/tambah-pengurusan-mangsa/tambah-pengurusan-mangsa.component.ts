import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import {
  CreateOrEditMangsaDto,
  InputCreateMangsaDto,
  InputBencanaMangsaDto,
  MangsaServiceProxy,
  RefDaerahServiceProxy,
  RefDunServiceProxy,
  RefNegeriServiceProxy,
  RefParlimenServiceProxy,
  RefPindahServiceProxy,
  SessionServiceProxy,
  GetProfilDto,
  OutputCreateEditMangsaDto
} from 'src/app/shared/proxy/service-proxies';
import { Router } from '@angular/router';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SelectBencanaComponent } from '../select-bencana/select-bencana.component';
import { fadeVerticalAnimation } from '@app/shared/data/router-animation/fade-vertical-animation';
import { ConfirmationService } from '@services/confirmation';

@Component({
	selector: 'app-tambah-pengurusan-mangsa',
	templateUrl: './tambah-pengurusan-mangsa.component.html',
  animations: [fadeVerticalAnimation]
})

export class TambahPengurusanMangsaComponent implements OnInit {

  addMangsa: InputCreateMangsaDto = new InputCreateMangsaDto();
  getProfile: GetProfilDto = new GetProfilDto();
  output: OutputCreateEditMangsaDto = new OutputCreateEditMangsaDto();

  dateNow = new Date();
  latest_date: string;
	saving = false;
  dun: any;
  parliaments: any;
  districts: any;
  states: any;
  evacuates: any;
  setDun: any;
  setDaerah: any;
  verify: number;
  viewStatus = false;
  filterIdNegeri: number;
  nama_bencana: string;
  modelBencana: NgbDateStruct;
  readonly DELIMITER = '-';

	constructor(
    public datePipe: DatePipe,
    private modalService: NgbModal,
    private _mangsaServiceProxy: MangsaServiceProxy,
    private _refDunServiceProxy: RefDunServiceProxy,
    private _refParlimenServiceProxy: RefParlimenServiceProxy,
    private _refDaerahServiceProxy: RefDaerahServiceProxy,
    private _refNegeriServiceProxy: RefNegeriServiceProxy,
    private _refPindahServiceProxy: RefPindahServiceProxy,
    private _sessionServiceProxy: SessionServiceProxy,
    private router: Router,
    private _confirmationService: ConfirmationService
  ) {
    this.latest_date = this.datePipe.transform(this.dateNow, 'dd-MM-yyyy');
		this.addMangsa = new InputCreateMangsaDto();
    this.addMangsa.mangsa = new CreateOrEditMangsaDto();
    this.addMangsa.bencana = new InputBencanaMangsaDto();
	}

	ngOnInit(): void {
    this.show();
    this.getDun();
    this.getParlimen();
    this.getDaerah();
    this.getNegeri();
    this.getStatusPindah();
    this.verify = 0;
    this.addMangsa.mangsa.status_verifikasi = 0;
  }

	show(): void {
		this._sessionServiceProxy.getProfil().subscribe((result) => {
			this.getProfile = result;
      this.addMangsa.mangsa.id_pengguna_cipta = result.pengguna.id;
		});
	}

  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      let date = value.split(this.DELIMITER);
      return {
        year : parseInt(date[0], 10),
        month : parseInt(date[1], 10),
        day : parseInt(date[2], 10)
      };
    }
    return null;
  }

  getDun(filter?, filterNegeri?) {
		this._refDunServiceProxy.getRefDunForDropdown(filter, filterNegeri).subscribe((result) => {
			this.dun = result.items;
		});
	}

  getParlimen(filter?) {
		this._refParlimenServiceProxy.getRefParlimenForDropdown(filter).subscribe((result) => {
			this.parliaments = result.items;
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

  getStatusPindah(filter?) {
		this._refPindahServiceProxy.getRefPindahForDropdown(filter).subscribe((result) => {
			this.evacuates = result.items;
		});
	}

	setParlimen() {
		this.addMangsa.mangsa.id_dun = this.setDun.id;
		this.addMangsa.mangsa.id_parlimen = this.setDun.id_parlimen;
	}

	setNegeri() {
		this.addMangsa.mangsa.id_daerah = this.setDaerah.id;
		this.addMangsa.mangsa.id_negeri = this.setDaerah.id_negeri;
    this.getDun(undefined, this.addMangsa.mangsa.id_negeri);
	}

  perakuan(isChecked) {
    if (isChecked) {
      this.verify = 1;
    }
    else {
      this.verify = 0;
    }
  }

	pilihBencana() {
		const modalRef = this.modalService.open(SelectBencanaComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
    modalRef.result.then(
			(response) => {
				if (response) {
          this.addMangsa.bencana.id_bencana = response.id;
          this.nama_bencana = response.nama_bencana;
          this.modelBencana = this.fromModel(response.tarikh_bencana.format('YYYY-MM-DD'));
          this.viewStatus = true;
				}
			}
		);
	}

	save(): void {
		this.saving = true;

		if (this.verify == 1) {
      this._mangsaServiceProxy
			.createOrEdit(this.addMangsa)
			.pipe(
				finalize(() => {
					this.saving = false;
				})
			)
			.subscribe((result) => {
        this.output = result;
        if(this.output.message == "Pendaftaran Mangsa Berjaya Disimpan!") {
          this.mangsaSave();
        }else{
          this._confirmationService.open({
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
        }
			});
    }
    else {
      this.perakuanSave();
    }
	}

  mangsaSave() {
    const dialogRef = this._confirmationService.open({
      title: 'Berjaya',
      message: 'Pendaftaran Mangsa Berjaya Disimpan',
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
      this.router.navigateByUrl('/app/mangsa/senarai');
    });
  }

  perakuanSave() {
    this._confirmationService.open({
      title: 'Tidak Berjaya',
      message: 'Pengesahan Perakuan Diperlukan',
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
