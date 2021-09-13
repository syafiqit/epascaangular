import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { CreateOrEditRefJenisBwiDto, RefJenisBwiServiceProxy } from '@app/shared/proxy/service-proxies';
import { swalSuccess } from '@app/shared/sweet-alert/swal-constant';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-tambah-edit-jenis-bwi',
	templateUrl: './tambah-edit-jenis-bwi.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TambahEditJenisBwiComponent implements OnInit {
	@Input() name;
	@Input() id;

	jenis_bwi: CreateOrEditRefJenisBwiDto = new CreateOrEditRefJenisBwiDto();
	saving = false;

	constructor(
		private modalService: NgbModal,
		public activeModal: NgbActiveModal,
    private _refJenisBwiServiceProxy: RefJenisBwiServiceProxy
	) {}

	ngOnInit(): void {
		this.show();
	}

	show() {
		if (!this.id) {
			this.jenis_bwi = new CreateOrEditRefJenisBwiDto();
		} else {
			this._refJenisBwiServiceProxy.getRefJenisBwiForEdit(this.id).subscribe((result) => {
				this.jenis_bwi = result.ref_jenis_bwi;
			});
		}
	}

	save(): void {
		this.saving = true;

		this._refJenisBwiServiceProxy
			.createOrEdit(this.jenis_bwi)
			.pipe()
			.subscribe(() => {
				if (this.name == 'add') {
					swalSuccess.fire('Berjaya!', 'Maklumat Jenis Bantuan Wang Ihsan Berjaya Ditambah.', 'success');
				} else if (this.name == 'edit') {
					swalSuccess.fire('Berjaya!', 'Maklumat Jenis Bantuan Wang Ihsan Berjaya Dikemaskini.', 'success');
				}
				this.activeModal.close(true);
			});
	}
}
