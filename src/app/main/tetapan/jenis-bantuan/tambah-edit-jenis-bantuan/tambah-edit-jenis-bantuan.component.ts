import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import { CreateOrEditRefBantuanDto, RefBantuanServiceProxy } from 'src/app/shared/proxy/service-proxies';
import { swalSuccess } from '@shared/sweet-alert/swal-constant';

@Component({
	selector: 'app-tambah-edit-jenis-bantuan',
	templateUrl: './tambah-edit-jenis-bantuan.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TambahEditJenisBantuanComponent implements OnInit {
	@Input() name;
	@Input() id;

	bantuan: CreateOrEditRefBantuanDto = new CreateOrEditRefBantuanDto();
	saving = true;

	constructor(
		private modalService: NgbModal,
		public activeModal: NgbActiveModal,
		private _refBantuanServiceProxy: RefBantuanServiceProxy
	) {}

	ngOnInit(): void {
		this.show();
	}

	show() {
		if (!this.id) {
			this.bantuan = new CreateOrEditRefBantuanDto();
		} else {
			this._refBantuanServiceProxy.getRefBantuanForEdit(this.id).subscribe((result) => {
				this.bantuan = result.ref_bantuan;
			});
		}
	}

	save(): void {
		this.saving = true;

		this._refBantuanServiceProxy
			.createOrEdit(this.bantuan)
			.pipe(
				finalize(() => {
					this.saving = false;
				})
			)
			.subscribe(() => {
				if (this.name == 'add') {
					swalSuccess.fire('Berjaya!', 'Maklumat Jenis Bantuan Berjaya Ditambah.', 'success');
				} else if (this.name == 'edit') {
					swalSuccess.fire('Berjaya!', 'Maklumat Jenis Bantuan Berjaya Dikemaskini.', 'success');
				}
				this.activeModal.close(true);
			});
	}
}
