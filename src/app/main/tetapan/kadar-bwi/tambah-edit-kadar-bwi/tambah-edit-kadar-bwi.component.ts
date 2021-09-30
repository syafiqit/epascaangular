import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { CreateOrEditRefKadarBwiDto, RefKadarBwiServiceProxy } from '@app/shared/proxy/service-proxies';
import { swalSuccess } from '@app/shared/sweet-alert/swal-constant';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';

@Component({
	selector: 'app-tambah-edit-kadar-bwi',
	templateUrl: './tambah-edit-kadar-bwi.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal, RefKadarBwiServiceProxy]
})
export class TambahEditKadarBwiComponent implements OnInit {
	@Input() name;
	@Input() id;

	kadar_bwi: CreateOrEditRefKadarBwiDto = new CreateOrEditRefKadarBwiDto();
	saving = true;

	constructor(
		private modalService: NgbModal,
		public activeModal: NgbActiveModal,
		private _refKadarBwiServiceProxy: RefKadarBwiServiceProxy
	) {}

	ngOnInit(): void {
		this.show();
	}

	show() {
		if (!this.id) {
			this.kadar_bwi = new CreateOrEditRefKadarBwiDto();
		} else {
			this._refKadarBwiServiceProxy.getRefKadarBwiForEdit(this.id).subscribe((result) => {
				this.kadar_bwi = result.ref_kadar_bwi;
			});
		}
	}

	save(): void {
		this.saving = true;

		this._refKadarBwiServiceProxy
			.createOrEdit(this.kadar_bwi)
			.pipe(
				finalize(() => {
					this.saving = false;
				})
			)
			.subscribe(() => {
				if (this.name == 'add') {
					swalSuccess.fire('Berjaya!', 'Maklumat Kadar Bantuan Wang Ihsan Berjaya Ditambah.', 'success');
				} else if (this.name == 'edit') {
					swalSuccess.fire('Berjaya!', 'Maklumat Kadar Bantuan Wang Ihsan Berjaya Dikemaskini.', 'success');
				}
				this.activeModal.close(true);
			});
	}
}
