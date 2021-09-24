import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { CreateOrEditRefBencanaBwiDto, RefBencanaBwiServiceProxy } from '@app/shared/proxy/service-proxies';
import { swalSuccess } from '@app/shared/sweet-alert/swal-constant';
import { NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-tambah-jumlah-bwi',
  templateUrl: './tambah-jumlah-bwi.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class TambahJumlahBwiComponent implements OnInit {
  @Input() name;
	@Input() id;
  @Input() idJumlahBwi;
	@Input() nilai;
  @Input() kategori;

  jumlahBwi: CreateOrEditRefBencanaBwiDto = new CreateOrEditRefBencanaBwiDto();
	saving = true;

	constructor(
		public activeModal: NgbActiveModal,
    private _refBencanaBwiServiceProxy: RefBencanaBwiServiceProxy
	) {}

  ngOnInit(): void {
    this.show();
  }

	show() {
		if (!this.id) {
			this.jumlahBwi = new CreateOrEditRefBencanaBwiDto();
      this.jumlahBwi.nilai = this.nilai;
		}
    else {
			this._refBencanaBwiServiceProxy.getRefBencanaBwiForEdit(this.id).subscribe((result) => {
				this.jumlahBwi = result.ref_bencana_bwi;
			});
		}
	}

	save(id, nilai): void {
    if (this.kategori == 1 && !this.idJumlahBwi) {
      this.activeModal.close({nilai: nilai });
    }
    else if (this.kategori == 1 && this.idJumlahBwi){
      this.activeModal.close({ id: this.idJumlahBwi, nilai: nilai });
    }
    else {
      this.saving = true;

      this._refBencanaBwiServiceProxy
        .createOrEdit(this.jumlahBwi)
        .pipe()
        .subscribe(() => {
          if (this.name == 'add') {
            swalSuccess.fire('Berjaya!', 'Jumlah BWI Berjaya Ditambah.', 'success');
          } else if (this.name == 'edit') {
            swalSuccess.fire('Berjaya!', 'Jumlah BWI Berjaya Dikemaskini.', 'success');
          }
          this.activeModal.close(true);
        });
    }
  }

}
