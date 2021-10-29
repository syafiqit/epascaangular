import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import {
  CreateOrEditMangsaAirDto,
  MangsaAirServiceProxy,
  OutputCreateMangsaAirDto,
  RefHubunganServiceProxy
} from 'src/app/shared/proxy/service-proxies';
import * as moment from 'moment';
import { ConfirmationService } from '@services/confirmation';
import { AppSessionService } from '@app/shared/services/app-session.service';

@Component({
	selector: 'app-tambah-edit-ahli-rumah-mangsa',
	templateUrl: './tambah-edit-ahli-rumah-mangsa.component.html',
  styleUrls: ['./tambah-edit-ahli-rumah-mangsa.component.scss']
})
export class TambahEditAhliRumahMangsaComponent implements OnInit {
	@Input() name;
	@Input() id;

  addAhli: CreateOrEditMangsaAirDto = new CreateOrEditMangsaAirDto();
  output: OutputCreateMangsaAirDto = new OutputCreateMangsaAirDto();
	saving = false;
  idMangsa: number;
  relationships: any;
  currentYear: number;
  birthYear: number;
  currentMonth: number;
  birthMonth: number;
  umur: any;

  date = new Date();
  birthDate: string;
  modelBirthdate: NgbDateStruct;
  today = this.calendar.getToday();
  readonly DELIMITER = '-';

	constructor(
    private calendar: NgbCalendar,
    public activeModal: NgbActiveModal,
    private _activatedRoute: ActivatedRoute,
    private _mangsaAirServiceProxy: MangsaAirServiceProxy,
    private _refHubunganServiceProxy: RefHubunganServiceProxy,
    private _confirmationService: ConfirmationService,
    public _appSession: AppSessionService,
  ) {
    this.idMangsa = this._activatedRoute.snapshot.queryParams['id'];
  }

	ngOnInit(): void {
    this.show();
    this.getHubungan();
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

  toModel(date: NgbDateStruct | null): string | null {
    return date ? date.year + this.DELIMITER + date.month + this.DELIMITER + date.day : null;
  }

  toModelYear(date: NgbDateStruct | null): number | null {
    return date ? date.year : null;
  }

  toModelMonth(date: NgbDateStruct | null): number | null {
    return date ? date.month : null;
  }

	show() {
		if (!this.id) {
			this.addAhli = new CreateOrEditMangsaAirDto();
		} else {
			this._mangsaAirServiceProxy.getMangsaAirForEdit(this.id).subscribe((result) => {
				this.addAhli = result.mangsa_air;
        if(result.mangsa_air.tarikh_lahir){
          this.modelBirthdate = this.fromModel(result.mangsa_air.tarikh_lahir.format('YYYY-MM-DD'));
        }
        if(result.mangsa_air.id_umur == 1){
          this.umur = result.mangsa_air.umur + " Tahun";
        }
        if(result.mangsa_air.id_umur == 2){
          this.umur = result.mangsa_air.umur + " Bulan";
        }
			});
		}
	}

	getHubungan(filter?) {
		this._refHubunganServiceProxy.getRefHubunganForDropdown(filter).subscribe((result) => {
			this.relationships = result.items;
		});
	}

  calculateAge() {
    this.currentYear = this.today.year;
    this.birthYear = this.toModelYear(this.modelBirthdate);
    this.addAhli.umur = this.currentYear - this.birthYear;
    this.addAhli.id_umur = 1;
    this.umur = this.addAhli.umur + " Tahun";
    if(this.addAhli.umur == 0) {
      this.currentMonth = this.today.month;
      this.birthMonth = this.toModelMonth(this.modelBirthdate);
      this.addAhli.umur = this.currentMonth - this.birthMonth;
      this.addAhli.id_umur = 2;
      this.umur = this.addAhli.umur + " Bulan";
    }
  }

	save(): void {
		this.saving = true;

    if(this.modelBirthdate){
      this.birthDate = this.toModel(this.modelBirthdate);
      this.addAhli.tarikh_lahir = moment(this.birthDate, "YYYY-MM-DD");
    }
    this.addAhli.id_mangsa = this.idMangsa;
		this._mangsaAirServiceProxy
			.createOrEdit(this.addAhli)
			.pipe(
				finalize(() => {
					this.saving = false;
				})
			)
			.subscribe((result) => {
        this.output = result;
        if(this.output.message == "Pendaftaran Ahli Isi Rumah Berjaya Disimpan!") {
          this.addAir();
        }
        else if(this.output.message == "Ahli Isi Rumah Berjaya Di Kemaskini!") {
          this.editAir();
        }else{
          this.errorAir();
        }
			});
	}

  addAir() {
    const dialogRef = this._confirmationService.open({
      title: 'Berjaya',
      message: 'Maklumat Ahli Isi Rumah Berjaya Ditambah.',
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
      this.activeModal.close(true);
    });
  }

  editAir() {
    const dialogRef = this._confirmationService.open({
      title: 'Berjaya',
      message: 'Maklumat Ahli Isi Rumah Berjaya Dikemaskini.',
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
      this.activeModal.close(true);
    });
  }

  errorAir() {
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
}
