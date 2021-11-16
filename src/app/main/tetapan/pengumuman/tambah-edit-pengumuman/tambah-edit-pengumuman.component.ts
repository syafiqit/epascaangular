import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { CreateOrEditRefPengumumanDto, RefPengumumanServiceProxy } from '@app/shared/proxy/service-proxies';
import { ConfirmationService } from '@app/shared/services/confirmation';
import { NgbActiveModal, NgbCalendar, NgbDateStruct, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
@Component({
	selector: 'app-tambah-edit-pengumuman',
	templateUrl: './tambah-edit-pengumuman.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class TambahEditPengumumanComponent implements OnInit {
	@Input() name;
  @Input() id;

  pengumuman: CreateOrEditRefPengumumanDto = new CreateOrEditRefPengumumanDto();
  saving = false;
  tarikh_mula: string;
  tarikh_tamat: string;

  date = new Date();
  modelMula: NgbDateStruct;
  modelTamat: NgbDateStruct;
  today = this.calendar.getToday();
  readonly DELIMITER = '-';

	constructor(
		private calendar: NgbCalendar,
    public activeModal: NgbActiveModal,
    private _confirmationService: ConfirmationService,
    private _refPengumumanServiceProxy: RefPengumumanServiceProxy
  ) {}

	ngOnInit(): void {
    this.show();
  }

	show() {
		if (!this.id) {
			this.pengumuman = new CreateOrEditRefPengumumanDto();
		} else {
			this._refPengumumanServiceProxy.getRefPengumumanForEdit(this.id).subscribe((result) => {
				this.pengumuman = result.ref_pengumuman;
				if(result.ref_pengumuman.tarikh_mula){
					this.modelMula = this.fromModel(result.ref_pengumuman.tarikh_mula.format('YYYY-MM-DD'));
				};
				if(result.ref_pengumuman.tarikh_tamat){
					this.modelTamat = this.fromModel(result.ref_pengumuman.tarikh_tamat.format('YYYY-MM-DD'));
				};
			});
		}
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

	save(): void {
		this.saving = true;

    if(this.modelMula){
      this.tarikh_mula = this.toModel(this.modelMula);
      this.pengumuman.tarikh_mula = moment(this.tarikh_mula, "YYYY-MM-DD");
    }
    if(this.modelTamat){
      this.tarikh_tamat = this.toModel(this.modelTamat);
      this.pengumuman.tarikh_tamat = moment(this.tarikh_tamat, "YYYY-MM-DD");
    }

		this._refPengumumanServiceProxy
			.createOrEdit(this.pengumuman)
			.pipe()
			.subscribe(() => {
				if (this.name == 'add') {
          this.addSave();
				} else if (this.name == 'edit') {
          this.editSave();
				}
			});
	}

  addSave() {
    const dialogRef = this._confirmationService.open({
      title: 'Berjaya',
      message: 'Maklumat Pengumuman Berjaya Ditambah',
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

  editSave() {
    const dialogRef = this._confirmationService.open({
      title: 'Berjaya',
      message: 'Maklumat Pengumuman Berjaya Dikemaskini',
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
}
