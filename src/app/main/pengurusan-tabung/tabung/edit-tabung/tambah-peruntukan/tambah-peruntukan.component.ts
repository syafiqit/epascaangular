import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { CreateOrEditTabungPeruntukanDto, RefSumberPeruntukanServiceProxy, TabungPeruntukanServiceProxy } from 'src/app/shared/proxy/service-proxies';
import * as moment from 'moment';
import { swalError, swalSuccess } from '@shared/sweet-alert/swal-constant';

@Component({
	selector: 'app-tambah-peruntukan',
	templateUrl: './tambah-peruntukan.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TambahPeruntukanComponent implements OnInit {
	@Input() name;
  @Input() id;
  @Input() idTabungPeruntukan;

  peruntukan: CreateOrEditTabungPeruntukanDto = new CreateOrEditTabungPeruntukanDto();

	modelFooter: NgbDateStruct;
	today = this.calendar.getToday();
  tarikhPeruntukan: string;
  sumberPeruntukan: any;
  peruntukanLama: number;
  peruntukanBaru: number;
  modelTarikhPeruntukan: NgbDateStruct;
  readonly DELIMITER = '-';

	constructor(
    public activeModal: NgbActiveModal,
    private calendar: NgbCalendar,
    private tabungPeruntukanServiceProxy: TabungPeruntukanServiceProxy,
    private _refSumberPeruntukanServiceProxy: RefSumberPeruntukanServiceProxy
    ) {}

	ngOnInit(): void {
    this.getSumberPeruntukan();
    this.show();
  }

  show() {
		if (this.id && !this.idTabungPeruntukan) {
			this.peruntukan = new CreateOrEditTabungPeruntukanDto();
		} else if(this.id){
			this.tabungPeruntukanServiceProxy.getTabungPeruntukanForEdit(this.idTabungPeruntukan).subscribe((result) => {
				this.peruntukan = result.tabung_peruntukan;
        this.peruntukanLama = result.tabung_peruntukan.jumlah;
        if(result.tabung_peruntukan.tarikh_peruntukan){
          this.modelTarikhPeruntukan = this.fromModel(result.tabung_peruntukan.tarikh_peruntukan.format('YYYY-MM-DD'));
        }
			});
		}
	}

  getSumberPeruntukan(filter?) {
    this._refSumberPeruntukanServiceProxy.getRefSumberPeruntukanForDropdown(filter).subscribe((result) => {
      this.sumberPeruntukan = result.items;
    });
  }

  jumlahPeruntukanBaru(jumlahBaru){
    this.peruntukanBaru = jumlahBaru;
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

  save() {
    if(this.modelTarikhPeruntukan){
      this.tarikhPeruntukan = this.toModel(this.modelTarikhPeruntukan);
      this.peruntukan.tarikh_peruntukan = moment(this.tarikhPeruntukan, "YYYY-MM-DD");
    }
    if(this.id && !this.idTabungPeruntukan){
      this.peruntukan.jumlah_lama = 0;
      this.peruntukan.jumlah_baru = this.peruntukanBaru;
    }
    if(this.id && this.idTabungPeruntukan){
      this.peruntukan.jumlah_lama = this.peruntukanLama;
      this.peruntukan.jumlah_baru = this.peruntukanBaru;
    }

    this.peruntukan.id_tabung = this.id;
    this.tabungPeruntukanServiceProxy.createOrEdit(this.peruntukan).subscribe((result)=>{
      if(this.id && !this.idTabungPeruntukan){
        swalSuccess.fire('Berjaya', 'Tambahan Dana Berjaya Ditambah').then(() => {
          this.activeModal.close(true);
        });
      }
      else if(this.id && this.idTabungPeruntukan){
        if(result.message == "Tambahan Dana Berjaya Dikemaskini"){
          swalSuccess.fire('Berjaya', result.message).then(() => {
            this.activeModal.close(true);
          });
        }else{
          swalError.fire('Tidak Berjaya', result.message)
        }
      }
    })
  }
}
