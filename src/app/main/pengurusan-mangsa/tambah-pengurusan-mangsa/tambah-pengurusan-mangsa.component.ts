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
  GetProfilDto
} from 'src/app/shared/proxy/service-proxies';
import { Router } from '@angular/router';
import { swalError, swalSuccess } from '@shared/sweet-alert/swal-constant';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SelectBencanaComponent } from '../select-bencana/select-bencana.component';
import { fadeVerticalAnimation } from '@app/shared/data/router-animation/fade-vertical-animation';

@Component({
	selector: 'app-tambah-pengurusan-mangsa',
	templateUrl: './tambah-pengurusan-mangsa.component.html',
  animations: [fadeVerticalAnimation]
})

export class TambahPengurusanMangsaComponent implements OnInit {

  addMangsa: InputCreateMangsaDto = new InputCreateMangsaDto();
  getProfile: GetProfilDto = new GetProfilDto();
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
    private router: Router
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
			.subscribe(() => {
				swalSuccess.fire('Berjaya!', 'Pendaftaran Mangsa Berjaya Disimpan!', 'success').then(() => {
					this.router.navigateByUrl('/app/mangsa/senarai-pengurusan-mangsa');
				});
			});
    }
    else {
      swalError.fire('Tidak Berjaya!', 'Pengesahan Perakuan Diperlukan!', 'error');
    }
	}
}
