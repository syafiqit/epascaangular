import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbCalendar, NgbDateStruct, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import {
  CreateOrEditMangsaAntarabangsaDto,
  GetMangsaAntarabangsaForEditDto,
  MangsaAntarabangsaServiceProxy,
  RefAgensiServiceProxy,
  RefBencanaServiceProxy
} from 'src/app/shared/proxy/service-proxies';
declare let require;
const Swal = require('sweetalert2');

@Component({
  selector: 'app-tambah-edit-bantuan-antarabangsa',
  templateUrl: './tambah-edit-bantuan-antarabangsa.component.html',
  encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TambahEditBantuanAntarabangsaComponent implements OnInit {

  @Input() name;
	@Input() id;
	@Input() idMangsa;

  antarabangsa: CreateOrEditMangsaAntarabangsaDto = new CreateOrEditMangsaAntarabangsaDto();
  editAntarabangsa: GetMangsaAntarabangsaForEditDto = new GetMangsaAntarabangsaForEditDto();

	saving = true;
  agensi: any;
  bencana: any;
  tarikh_bantuan: string;

  date = new Date();
  model: NgbDateStruct;
  today = this.calendar.getToday();
  readonly DELIMITER = '-';

  constructor
  (
    public activeModal: NgbActiveModal,
		private _mangsaAntarabangsaServiceProxy: MangsaAntarabangsaServiceProxy,
    private _refAgensiServiceProxy: RefAgensiServiceProxy,
    private _refBencanaServiceProxy: RefBencanaServiceProxy,
    private calendar: NgbCalendar
  ) {
    this.editAntarabangsa.mangsa_antarabangsa = new CreateOrEditMangsaAntarabangsaDto();
   }

  ngOnInit(): void {
    this.show();
    this.getBencana();
    this.getAgensi();
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
      this.antarabangsa = new CreateOrEditMangsaAntarabangsaDto();
    } else {
      this._mangsaAntarabangsaServiceProxy.getMangsaAntarabangsaForEdit(this.id).subscribe((result) => {
        this.antarabangsa = result.mangsa_antarabangsa;
        if(result.mangsa_antarabangsa.tarikh_bantuan){
          this.model = this.fromModel(result.mangsa_antarabangsa.tarikh_bantuan.format('YYYY-MM-DD'));
        }
      });
    }
  }

  getAgensi(filter?) {
    this._refAgensiServiceProxy.getRefAgensiForDropdown(filter).subscribe((result) => {
      this.agensi = result.items;
    });
  }

  getBencana(filter?) {
    this._refBencanaServiceProxy.getRefBencanaForDropdown(filter).subscribe((result) => {
      this.bencana = result.items;
    });
  }

  save() {
    this.saving = true;
    if(this.model){
      this.tarikh_bantuan = this.toModel(this.model);
      this.antarabangsa.tarikh_bantuan = moment(this.tarikh_bantuan, "YYYY-MM-DD");
    }
    this.antarabangsa.id_mangsa = this.idMangsa;
    this._mangsaAntarabangsaServiceProxy
      .createOrEdit(this.antarabangsa)
      .pipe()
      .subscribe((result) => {
        if (this.name == 'add') {
          Swal.fire('Berjaya!', 'Maklumat Bantuan Antarabangsa Berjaya Ditambah.', 'success');
        } else if (this.name == 'edit') {
          Swal.fire('Berjaya!', 'Maklumat Bantuan Antarabangsa Berjaya Dikemaskini.', 'success');
        }
        this.activeModal.close(true);
      });
  }

}
