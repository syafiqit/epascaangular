import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { CreateOrEditRefKerosakanDto, RefKerosakanServiceProxy } from '../../../../shared/proxy/service-proxies';
declare let require;
const Swal = require('sweetalert2');

@Component({
	selector: 'app-tambah-edit-kerosakan-rumah',
	templateUrl: './tambah-edit-kerosakan-rumah.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TambahEditKerosakanRumahComponent implements OnInit {
	@Input() name;
	@Input() id;

	kerosakan: CreateOrEditRefKerosakanDto = new CreateOrEditRefKerosakanDto();
	saving = false;

	states: any[];

	constructor(
		private modalService: NgbModal,
		public activeModal: NgbActiveModal,
		private _refKerosakanServiceProxy: RefKerosakanServiceProxy
	) {}

	ngOnInit(): void {
		this.show();
	}

	show() {
		if (!this.id) {
			this.kerosakan = new CreateOrEditRefKerosakanDto();
		} else {
			this._refKerosakanServiceProxy.getRefKerosakanForEdit(this.id).subscribe((result) => {
				this.kerosakan = result.ref_kerosakan;
			});
		}
	}

	save(): void {
		this.saving = true;

		this._refKerosakanServiceProxy
			.createOrEdit(this.kerosakan)
			.pipe()
			.subscribe(() => {
				if (this.name == 'add') {
					Swal.fire('Berjaya!', 'Maklumat Kerosakan Rumah Berjaya Ditambah.', 'success');
				} else if (this.name == 'edit') {
					Swal.fire('Berjaya!', 'Maklumat Kerosakan Rumah Berjaya Dikemaskini.', 'success');
				}
				this.activeModal.close(true);
			});
	}
}
