import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { CreateOrEditRefPerananDto, RefPerananServiceProxy } from '../../../../shared/proxy/service-proxies';
import { swalSuccess } from '@shared/sweet-alert/swal-constant';

@Component({
	selector: 'app-tambah-edit-peranan',
	templateUrl: './tambah-edit-peranan.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TambahEditPerananComponent implements OnInit {
	@Input() name;
	@Input() id;

	peranan: CreateOrEditRefPerananDto = new CreateOrEditRefPerananDto();
	saving = false;

	states: any[];

	constructor(
		private modalService: NgbModal,
		public activeModal: NgbActiveModal,
		private _refPerananServiceProxy: RefPerananServiceProxy
	) {}

	ngOnInit(): void {
		this.show();
	}

	show() {
		if (!this.id) {
			this.peranan = new CreateOrEditRefPerananDto();
		} else {
			this._refPerananServiceProxy.getRefPerananForEdit(this.id).subscribe((result) => {
				this.peranan = result.ref_peranan;
			});
		}
	}

	save(): void {
		this.saving = true;

		this._refPerananServiceProxy
			.createOrEdit(this.peranan)
			.pipe()
			.subscribe(() => {
				if (this.name == 'add') {
					swalSuccess.fire('Berjaya!', 'Maklumat Peranan Berjaya Ditambah.', 'success');
				} else if (this.name == 'edit') {
					swalSuccess.fire('Berjaya!', 'Maklumat Peranan Berjaya Dikemaskini.', 'success');
				}
				this.activeModal.close(true);
			});
	}
}
