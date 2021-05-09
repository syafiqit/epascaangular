import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { CreateOrEditMangsaWangIhsanDto, GetMangsaWangIhsanForEditDto, MangsaWangIhsanServiceProxy, RefAgensiServiceProxy, RefBencanaServiceProxy } from 'src/app/shared/proxy/service-proxies';
declare let require;
const Swal = require('sweetalert2');

@Component({
  selector: 'app-tambah-edit-bantuan-wang-ihsan',
  templateUrl: './tambah-edit-bantuan-wang-ihsan.component.html',
  encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TambahEditBantuanWangIhsanComponent implements OnInit {

  @Input() name;
	@Input() id;
	@Input() idMangsa;

  wangIhsan: CreateOrEditMangsaWangIhsanDto = new CreateOrEditMangsaWangIhsanDto();
  editWangIhsan: GetMangsaWangIhsanForEditDto = new GetMangsaWangIhsanForEditDto();

	saving = true;
  agensi: any;
  agency: any;
  bencana: any;
  disaster: any;
  tarikhSerahan: string;

  constructor(
		public activeModal: NgbActiveModal,
		private _mangsaWangIhsanServiceProxy: MangsaWangIhsanServiceProxy,
    private _refAgensiServiceProxy: RefAgensiServiceProxy,
    private _refBencanaServiceProxy: RefBencanaServiceProxy
    ) {
      this.editWangIhsan.mangsa_wang_ihsan = new CreateOrEditMangsaWangIhsanDto();
    }

    ngOnInit(): void {
      this.show();
      this.getBencana();
      this.getAgensi();
    }

    show() {
      if (!this.id) {
        this.wangIhsan = new CreateOrEditMangsaWangIhsanDto();
      } else {
        this._mangsaWangIhsanServiceProxy.getMangsaWangIhsanForEdit(this.id).subscribe((result) => {
          this.wangIhsan = result.mangsa_wang_ihsan;
        });
      }
    }

    getAgensi(filter?) {
      this._refAgensiServiceProxy.getRefAgensiForDropdown(filter).subscribe((result) => {
        this.agency = result.items;
      });
    }

    getBencana(filter?) {
      this._refBencanaServiceProxy.getRefBencanaForDropdown(filter).subscribe((result) => {
        this.disaster = result.items;
      });
    }

    save() {
      this.saving = true;
      this.wangIhsan.id_mangsa = this.idMangsa;
      this._mangsaWangIhsanServiceProxy
        .createOrEdit(this.wangIhsan)
        .pipe()
        .subscribe((result) => {
          if (this.name == 'add') {
            Swal.fire('Berjaya!', 'Maklumat Bantuan Wang Ihsan Berjaya Ditambah.', 'success');
          } else if (this.name == 'edit') {
            Swal.fire('Berjaya!', 'Maklumat Bantuan Wang Ihsan Berjaya Dikemaskini.', 'success');
          }
          this.activeModal.close(true);
        });
    }

}
