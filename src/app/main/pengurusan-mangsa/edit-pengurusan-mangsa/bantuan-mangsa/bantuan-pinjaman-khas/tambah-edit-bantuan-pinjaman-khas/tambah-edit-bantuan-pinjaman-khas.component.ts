import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { CreateOrEditMangsaPinjamanDto, GetMangsaPinjamanForEditDto, MangsaPinjamanServiceProxy, RefAgensiServiceProxy, RefBencanaServiceProxy, RefSektorServiceProxy } from 'src/app/shared/proxy/service-proxies';
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
  tarikh_mula: string;

  constructor(
    public activeModal: NgbActiveModal,
		private _mangsaPinjamanServiceProxy: MangsaPinjamanServiceProxy,
    private _refAgensiServiceProxy: RefAgensiServiceProxy,
    private _refBencanaServiceProxy: RefBencanaServiceProxy,
    private _refSektorServiceProxy: RefSektorServiceProxy
    ) {
      this.editPinjamanKhas.mangsa_pinjaman = new CreateOrEditMangsaPinjamanDto();
    }

  ngOnInit(): void {
    this.show();
    this.getBencana();
    this.getAgensi();
    this.getSektor();
  }

  show() {
    if (!this.id) {
      this.pinjamanKhas = new CreateOrEditMangsaPinjamanDto();
    } else {
      this._mangsaPinjamanServiceProxy.getMangsaPinjamanForEdit(this.id).subscribe((result) => {
        this.pinjamanKhas = result.mangsa_pinjaman;
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
    this.pinjamanKhas.tarikh_mula = moment(this.tarikh_mula);
    this.pinjamanKhas.id_mangsa = this.idMangsa;
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
