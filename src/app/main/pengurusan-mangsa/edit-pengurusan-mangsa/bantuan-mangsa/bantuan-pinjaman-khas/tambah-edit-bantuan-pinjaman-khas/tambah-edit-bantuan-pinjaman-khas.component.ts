import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbCalendar, NgbDateStruct, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import {
  CreateOrEditMangsaPinjamanDto,
  GetMangsaPinjamanForEditDto,
  MangsaPinjamanServiceProxy,
  RefAgensiServiceProxy,
  RefBencanaServiceProxy,
  RefSektorServiceProxy
} from 'src/app/shared/proxy/service-proxies';
declare let require;
const Swal = require('sweetalert2');

@Component({
  selector: 'app-tambah-edit-bantuan-pinjaman-khas',
  templateUrl: './tambah-edit-bantuan-pinjaman-khas.component.html',
  encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TambahEditBantuanPinjamanKhasComponent implements OnInit {

  @Input() name;
	@Input() id;
	@Input() idMangsa;

  pinjamanKhas: CreateOrEditMangsaPinjamanDto = new CreateOrEditMangsaPinjamanDto();
  editPinjamanKhas: GetMangsaPinjamanForEditDto = new GetMangsaPinjamanForEditDto();

	saving = true;
  agensi: any;
  bencana: any;
  sektor: any;

  date = new Date();
  model: NgbDateStruct;
  today = this.calendar.getToday();
  tarikh_mula: string;
  readonly DELIMITER = '-';

  status=[
    {id: 1, nama_status: "Tidak Aktif"},
    {id: 2, nama_status: "Aktif"}
  ]

  constructor(
    public activeModal: NgbActiveModal,
		private _mangsaPinjamanServiceProxy: MangsaPinjamanServiceProxy,
    private _refAgensiServiceProxy: RefAgensiServiceProxy,
    private _refBencanaServiceProxy: RefBencanaServiceProxy,
    private _refSektorServiceProxy: RefSektorServiceProxy,
    private calendar: NgbCalendar
    ) {
      this.editPinjamanKhas.mangsa_pinjaman = new CreateOrEditMangsaPinjamanDto();
    }

  ngOnInit(): void {
    this.show();
    this.getBencana();
    this.getAgensi();
    this.getSektor();
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
      this.pinjamanKhas = new CreateOrEditMangsaPinjamanDto();
    } else {
      this._mangsaPinjamanServiceProxy.getMangsaPinjamanForEdit(this.id).subscribe((result) => {
        this.pinjamanKhas = result.mangsa_pinjaman;
        if(result.mangsa_pinjaman.tarikh_mula){
          this.model = this.fromModel(result.mangsa_pinjaman.tarikh_mula.format('YYYY-MM-DD'));
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

  getSektor(filter?) {
    this._refSektorServiceProxy.getRefSektorForDropdown(filter).subscribe((result) => {
      this.sektor = result.items;
    });
  }

  save() {
    this.saving = true;
    this.pinjamanKhas.id_mangsa = this.idMangsa;
    if(this.model){
      this.tarikh_mula = this.toModel(this.model);
      this.pinjamanKhas.tarikh_mula = moment(this.tarikh_mula, "YYYY-MM-DD");
    }
    this._mangsaPinjamanServiceProxy
      .createOrEdit(this.pinjamanKhas)
      .pipe()
      .subscribe((result) => {
        if (this.name == 'add') {
          Swal.fire('Berjaya!', 'Maklumat Bantuan Pinjaman Khas Berjaya Ditambah.', 'success');
        } else if (this.name == 'edit') {
          Swal.fire('Berjaya!', 'Maklumat Bantuan Pinjaman Khas Berjaya Dikemaskini.', 'success');
        }
        this.activeModal.close(true);
      });
  }

}
