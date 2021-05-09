import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { CreateOrEditMangsaAntarabangsaDto, GetMangsaAntarabangsaForEditDto, MangsaAntarabangsaServiceProxy, RefAgensiServiceProxy, RefBencanaServiceProxy } from 'src/app/shared/proxy/service-proxies';
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

  constructor
  (
    public activeModal: NgbActiveModal,
		private _mangsaAntarabangsaServiceProxy: MangsaAntarabangsaServiceProxy,
    private _refAgensiServiceProxy: RefAgensiServiceProxy,
    private _refBencanaServiceProxy: RefBencanaServiceProxy
  ) {
    this.editAntarabangsa.mangsa_antarabangsa = new CreateOrEditMangsaAntarabangsaDto();
   }

  ngOnInit(): void {
    this.show();
    this.getBencana();
    this.getAgensi();
  }

  show() {
    if (!this.id) {
      this.antarabangsa = new CreateOrEditMangsaAntarabangsaDto();
    } else {
      this._mangsaAntarabangsaServiceProxy.getMangsaAntarabangsaForEdit(this.id).subscribe((result) => {
        this.antarabangsa = result.mangsa_antarabangsa;
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
    this.antarabangsa.tarikh_bantuan = moment(this.tarikh_bantuan);
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
