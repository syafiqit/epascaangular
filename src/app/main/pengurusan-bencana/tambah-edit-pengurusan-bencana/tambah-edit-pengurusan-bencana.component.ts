import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NgbActiveModal, NgbCalendar, NgbDateStruct, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import * as moment from 'moment';
import {
  CreateOrEditRefBencanaDto,
  RefBencanaServiceProxy,
  RefJenisBencanaServiceProxy,
  RefNegeriServiceProxy
} from 'src/app/shared/proxy/service-proxies';
declare let require;
const Swal = require('sweetalert2');

@Component({
  selector: 'app-tambah-edit-pengurusan-bencana',
  templateUrl: './tambah-edit-pengurusan-bencana.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})

export class TambahEditPengurusanBencanaComponent implements OnInit {
  @Input() name;
	@Input() id;

	pengurusan_bencana: CreateOrEditRefBencanaDto = new CreateOrEditRefBencanaDto();
	saving = true;
	filter: any;
	disasters: any;
	states: any;
	tarikhBencana: any;
	dateDisaster: string;

  date = new Date();
  model: NgbDateStruct;
  today = this.calendar.getToday();
  readonly DELIMITER = '-';

	constructor(
		private modalService: NgbModal,
		public activeModal: NgbActiveModal,
		private _refBencanaServiceProxy: RefBencanaServiceProxy,
		private _refJenisBencanaServiceProxy: RefJenisBencanaServiceProxy,
		private _refNegeriServiceProxy: RefNegeriServiceProxy,
    private calendar: NgbCalendar
	) { }

	ngOnInit(): void {
		this.show();
		this.getBencana();
		this.getNegeri();
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

	show() {
		if (!this.id) {
			this.pengurusan_bencana = new CreateOrEditRefBencanaDto();
		} else {
			this._refBencanaServiceProxy.getRefBencanaForEdit(this.id).subscribe((result) => {
				this.pengurusan_bencana = result.ref_bencana;
        if(result.ref_bencana.tarikh_bencana){
          this.model = this.fromModel(result.ref_bencana.tarikh_bencana.format('YYYY-MM-DD'));
        }
			});
		}
	}

	getBencana(filter?) {
		this._refJenisBencanaServiceProxy.getRefJenisBencanaForDropdown(filter).subscribe((result) => {
			this.disasters = result.items;
		});
	}

	getNegeri(filter?) {
		this._refNegeriServiceProxy.getRefNegeriForDropdown(filter).subscribe((result) => {
			this.states = result.items;
		});
	}

	save(): void {
		this.saving = true;
    if(this.model){
      this.dateDisaster = this.toModel(this.model);
      this.pengurusan_bencana.tarikh_bencana = moment(this.dateDisaster, "YYYY-MM-DD");
    }
		this._refBencanaServiceProxy
			.createOrEdit(this.pengurusan_bencana)
			.pipe(
				finalize(() => {
					this.saving = false;
				})
			)
			.subscribe(() => {
				if (this.name == 'add') {
					Swal.fire('Berjaya!', 'Maklumat Agensi Berjaya diTambah.', 'success');
				} else if (this.name == 'edit') {
					Swal.fire('Berjaya!', 'Maklumat Agensi Berjaya diUbah.', 'success');
				}
				this.activeModal.close(true);
			});
	}

}
