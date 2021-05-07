import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
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
  RefBencanaServiceProxy
} from 'src/app/shared/proxy/service-proxies';
declare let require;
const Swal = require('sweetalert2');

@Component({
	selector: 'app-tambah-pengurusan-mangsa',
	templateUrl: './tambah-pengurusan-mangsa.component.html'
})

export class TambahPengurusanMangsaComponent implements OnInit {

  addMangsa: InputCreateMangsaDto = new InputCreateMangsaDto();
	saving = false;
  dun: any;
  parliaments: any;
  districts: any;
  states: any;
  disasters: any;
  evacuates: any;
  setDun: any;
  setDaerah: any;
  verify: number;

	constructor(
    private _mangsaServiceProxy: MangsaServiceProxy,
    private _refDunServiceProxy: RefDunServiceProxy,
    private _refParlimenServiceProxy: RefParlimenServiceProxy,
    private _refDaerahServiceProxy: RefDaerahServiceProxy,
    private _refNegeriServiceProxy: RefNegeriServiceProxy,
    private _refBencanaServiceProxy: RefBencanaServiceProxy,
    private _refPindahServiceProxy: RefPindahServiceProxy
  ) {
		this.addMangsa = new InputCreateMangsaDto();
    this.addMangsa.mangsa = new CreateOrEditMangsaDto();
    this.addMangsa.bencana = new InputBencanaMangsaDto();
	}

	ngOnInit(): void {
    this.getDun();
    this.getParlimen();
    this.getDaerah();
    this.getNegeri();
    this.getBencana();
    this.getStatusPindah();
  }

  getDun(filter?) {
		this._refDunServiceProxy.getRefDunForDropdown(filter).subscribe((result) => {
			this.dun = result.items;
		});
	}

  getParlimen(filter?) {
		this._refParlimenServiceProxy.getRefParlimenForDropdown(filter).subscribe((result) => {
			this.parliaments = result.items;
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

  getBencana(filter?) {
		this._refBencanaServiceProxy.getRefBencanaForDropdown(filter).subscribe((result) => {
			this.disasters = result.items;
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
	}

  perakuan(isChecked) {
    if (isChecked) {
      this.verify = 1;
    }
    else {
      this.verify = 0;
    }
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
			.subscribe(() => {
				Swal.fire('Berjaya!', 'Pendaftaran Mangsa Berjaya Disimpan!', 'success').then(() => {
					location.href = '/app/mangsa/senarai-pengurusan-mangsa';
				});
			});
    }
    else {
      Swal.fire('Tidak Berjaya!', 'Pengesahan Perakuan Diperlukan!', 'error');
    }
	}
}
