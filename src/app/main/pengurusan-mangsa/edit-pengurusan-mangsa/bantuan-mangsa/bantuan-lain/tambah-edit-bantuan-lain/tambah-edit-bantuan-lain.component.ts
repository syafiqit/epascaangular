import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { CreateOrEditMangsaBantuanDto, GetMangsaBantuanForEditDto, MangsaBantuanServiceProxy, RefAgensiServiceProxy, RefBencanaServiceProxy, RefSumberDanaServiceProxy } from 'src/app/shared/proxy/service-proxies';
declare let require;
const Swal = require('sweetalert2');

@Component({
  selector: 'app-tambah-edit-bantuan-lain',
  templateUrl: './tambah-edit-bantuan-lain.component.html',
  encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TambahEditBantuanLainComponent implements OnInit {

  @Input() name;
	@Input() id;
	@Input() idMangsa;

  bantuanLain: CreateOrEditMangsaBantuanDto = new CreateOrEditMangsaBantuanDto();
  editBantuanLain: GetMangsaBantuanForEditDto = new GetMangsaBantuanForEditDto();

	saving = true;
  agensi: any;
  bencana: any;
  sumberDana: any;
  tarikh_bantuan: string;

  constructor(
    public activeModal: NgbActiveModal,
		private _mangsaBantuanServiceProxy: MangsaBantuanServiceProxy,
    private _refAgensiServiceProxy: RefAgensiServiceProxy,
    private _refBencanaServiceProxy: RefBencanaServiceProxy,
    private _refSumberDanaServiceProxy: RefSumberDanaServiceProxy
  ) {
    this.editBantuanLain.mangsa_bantuan = new CreateOrEditMangsaBantuanDto();
  }

  ngOnInit(): void {
    this.show();
    this.getBencana();
    this.getAgensi();
    this.getSumberDana();
  }

  show() {
    if (!this.id) {
      this.bantuanLain = new CreateOrEditMangsaBantuanDto();
    } else {
      this._mangsaBantuanServiceProxy.getMangsaBantuanForEdit(this.id).subscribe((result) => {
        this.bantuanLain = result.mangsa_bantuan;
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

  getSumberDana(filter?) {
    this._refSumberDanaServiceProxy.getRefSumberDanaForDropdown(filter).subscribe((result) => {
      this.sumberDana = result.items;
    });
  }

  save() {
    this.saving = true;
    this.bantuanLain.tarikh_bantuan = moment(this.tarikh_bantuan);
    this.bantuanLain.id_mangsa = this.idMangsa;
    this._mangsaBantuanServiceProxy
      .createOrEdit(this.bantuanLain)
      .pipe()
      .subscribe((result) => {
        if (this.name == 'add') {
          Swal.fire('Berjaya!', 'Maklumat Bantuan Lain Berjaya Ditambah.', 'success');
        } else if (this.name == 'edit') {
          Swal.fire('Berjaya!', 'Maklumat Bantuan Lain Berjaya Dikemaskini.', 'success');
        }
        this.activeModal.close(true);
      });
  }

}
