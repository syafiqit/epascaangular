import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { CreateOrEditMangsaRumahDto, GetMangsaRumahForEditDto, MangsaRumahServiceProxy, RefBantuanServiceProxy, RefBencanaServiceProxy, RefKerosakanServiceProxy, RefPelaksanaServiceProxy, RefPemilikServiceProxy, RefStatusKemajuanServiceProxy, RefSumberDanaServiceProxy, RefTapakRumahServiceProxy } from 'src/app/shared/proxy/service-proxies';
declare let require;
const Swal = require('sweetalert2');

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
  tarikh_mula: string;
  tarikh_siap: string;

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
    private _refStatusKemajuanServiceProxy: RefStatusKemajuanServiceProxy
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

  show() {
    if (!this.id) {
      this.bantuanRumah = new CreateOrEditMangsaRumahDto();
    } else {
      this._mangsaRumahServiceProxy.getMangsaRumahForEdit(this.id).subscribe((result) => {
        this.bantuanRumah = result.mangsa_rumah;
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
    this.bantuanRumah.tarikh_mula = moment(this.tarikh_mula);
    this.bantuanRumah.tarikh_siap = moment(this.tarikh_siap);
    this.bantuanRumah.id_mangsa = this.idMangsa;
    this._mangsaRumahServiceProxy
      .createOrEdit(this.bantuanRumah)
      .pipe()
      .subscribe((result) => {
        if (this.name == 'add') {
          Swal.fire('Berjaya!', 'Maklumat Bantuan Rumah Berjaya Ditambah.', 'success');
        } else if (this.name == 'edit') {
          Swal.fire('Berjaya!', 'Maklumat Bantuan Rumah Berjaya Dikemaskini.', 'success');
        }
        this.activeModal.close(true);
      });
  }

}
