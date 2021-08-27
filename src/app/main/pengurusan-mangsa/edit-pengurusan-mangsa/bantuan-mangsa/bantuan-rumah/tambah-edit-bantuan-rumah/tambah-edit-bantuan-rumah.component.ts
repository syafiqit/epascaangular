import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbCalendar, NgbDateStruct, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { CreateOrEditMangsaRumahDto, GetMangsaRumahForEditDto, MangsaRumahServiceProxy, RefBantuanServiceProxy, RefBencanaServiceProxy, RefKerosakanServiceProxy, RefPelaksanaServiceProxy, RefPemilikServiceProxy, RefStatusKemajuanServiceProxy, RefSumberDanaServiceProxy, RefTapakRumahServiceProxy } from 'src/app/shared/proxy/service-proxies';
import { swalSuccess } from '@shared/sweet-alert/swal-constant';

@Component({
  selector: 'app-tambah-edit-bantuan-rumah',
  templateUrl: './tambah-edit-bantuan-rumah.component.html',
  encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TambahEditBantuanRumahComponent implements OnInit {

  @Input() name;
	@Input() id;
	@Input() idMangsa;

  bantuanRumah: CreateOrEditMangsaRumahDto = new CreateOrEditMangsaRumahDto();
  editBantuanRumah: GetMangsaRumahForEditDto= new GetMangsaRumahForEditDto();

	saving = true;
  pemilik: any;
  bencana: any;
  jenisBantuan: any;
  kerosakan: any;
  tapakRumah: any;
  sumberDana: any;
  pelaksana: any;
  statusKemajuan: any;
  date = new Date();
  modelMula: NgbDateStruct;
  modelSiap: NgbDateStruct;
  today = this.calendar.getToday();
  tarikh_mula: string;
  tarikh_siap: string;
  readonly DELIMITER = '-';

  status=[
    {id: 1, nama_status: "Tidak Aktif"},
    {id: 2, nama_status: "Aktif"}
  ]

	constructor(
    public activeModal: NgbActiveModal,
		private _mangsaRumahServiceProxy: MangsaRumahServiceProxy,
    private _refPemilikServiceProxy: RefPemilikServiceProxy,
    private _refBencanaServiceProxy: RefBencanaServiceProxy,
    private _refBantuanServiceProxy: RefBantuanServiceProxy,
    private _refKerosakanServiceProxy: RefKerosakanServiceProxy,
    private _refTapakRumahServiceProxy: RefTapakRumahServiceProxy,
    private _refSumberDanaServiceProxy: RefSumberDanaServiceProxy,
    private _refPelaksanaServiceProxy: RefPelaksanaServiceProxy,
    private _refStatusKemajuanServiceProxy: RefStatusKemajuanServiceProxy,
    private calendar: NgbCalendar
    ) {
    this.editBantuanRumah.mangsa_rumah = new CreateOrEditMangsaRumahDto();
	}

  ngOnInit(): void {
    this.show();
    this.getBencana();
    this.getPemilik();
    this.getJenisBantuan();
    this.getKerosakan();
    this.getTapakRumah();
    this.getSumberDana();
    this.getPelaksana();
    this.getStatusKemajuan();
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
      this.bantuanRumah = new CreateOrEditMangsaRumahDto();
    } else {
      this._mangsaRumahServiceProxy.getMangsaRumahForEdit(this.id).subscribe((result) => {
        this.bantuanRumah = result.mangsa_rumah;
        if(result.mangsa_rumah.tarikh_mula){
          this.modelMula = this.fromModel(result.mangsa_rumah.tarikh_mula.format('YYYY-MM-DD'));
        }
        if(result.mangsa_rumah.tarikh_siap){
          this.modelSiap = this.fromModel(result.mangsa_rumah.tarikh_siap.format('YYYY-MM-DD'));
        }
      });
    }
  }

  getPemilik(filter?) {
    this._refPemilikServiceProxy.getRefPemilikForDropdown(filter).subscribe((result) => {
      this.pemilik = result.items;
    });
  }

  getBencana(filter?) {
    this._refBencanaServiceProxy.getRefBencanaForDropdown(filter).subscribe((result) => {
      this.bencana = result.items;
    });
  }

  getJenisBantuan(filter?) {
    this._refBantuanServiceProxy.getRefBantuanForDropdown(filter).subscribe((result) => {
      this.jenisBantuan = result.items;
    });
  }

  getKerosakan(filter?) {
    this._refKerosakanServiceProxy.getRefKerosakanForDropdown(filter).subscribe((result) => {
      this.kerosakan = result.items;
    });
  }

  getTapakRumah(filter?) {
    this._refTapakRumahServiceProxy.getRefTapakRumahForDropdown(filter).subscribe((result) => {
      this.tapakRumah = result.items;
    });
  }

  getSumberDana(filter?) {
    this._refSumberDanaServiceProxy.getRefSumberDanaForDropdown(filter).subscribe((result) => {
      this.sumberDana = result.items;
    });
  }

  getPelaksana(filter?) {
    this._refPelaksanaServiceProxy.getRefPelaksanaForDropdown(filter).subscribe((result) => {
      this.pelaksana = result.items;
    });
  }

  getStatusKemajuan(filter?) {
    this._refStatusKemajuanServiceProxy.getRefStatusKemajuanForDropdown(filter).subscribe((result) => {
      this.statusKemajuan = result.items;
    });
  }

  save() {
    this.saving = true;
    if(this.modelMula){
      this.tarikh_mula = this.toModel(this.modelMula);
      this.bantuanRumah.tarikh_mula = moment(this.tarikh_mula, "YYYY-MM-DD");
    }
    if(this.modelSiap){
      this.tarikh_siap = this.toModel(this.modelSiap);
      this.bantuanRumah.tarikh_siap = moment(this.tarikh_siap, "YYYY-MM-DD");
    }
    this.bantuanRumah.id_mangsa = this.idMangsa;
    this._mangsaRumahServiceProxy
      .createOrEdit(this.bantuanRumah)
      .pipe()
      .subscribe((result) => {
        if (this.name == 'add') {
          swalSuccess.fire('Berjaya!', 'Maklumat Bantuan Rumah Berjaya Ditambah.', 'success');
        } else if (this.name == 'edit') {
          swalSuccess.fire('Berjaya!', 'Maklumat Bantuan Rumah Berjaya Dikemaskini.', 'success');
        }
        this.activeModal.close(true);
      });
  }

}
