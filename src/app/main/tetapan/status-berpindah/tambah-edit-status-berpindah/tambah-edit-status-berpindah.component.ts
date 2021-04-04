import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { CreateOrEditRefPindahDto, RefPindahServiceProxy } from '../../../../shared/proxy/service-proxies';
declare let require;
const Swal = require('sweetalert2');

@Component({
	selector: 'app-tambah-edit-status-berpindah',
	templateUrl: './tambah-edit-status-berpindah.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TambahEditStatusBerpindahComponent implements OnInit {
	@Input() name;
	@Input() id;

	pindah: CreateOrEditRefPindahDto = new CreateOrEditRefPindahDto();
	saving = false;

	states: any[];

	constructor(
		private modalService: NgbModal,
		public activeModal: NgbActiveModal,
		private _refPindahServiceProxy: RefPindahServiceProxy
	) {}

	ngOnInit(): void {
		this.show();
	}

	show() {
		if (!this.id) {
			this.pindah = new CreateOrEditRefPindahDto();
		} else {
			this._refPindahServiceProxy.getRefPindahForEdit(this.id).subscribe((result) => {
				this.pindah = result.ref_pindah;
			});
		}
	}

	save(): void {
		this.saving = true;

		this._refPindahServiceProxy
			.createOrEdit(this.pindah)
			.pipe()
			.subscribe(() => {
				if (this.name == 'add') {
					Swal.fire('Berjaya!', 'Maklumat Status Berpindah Berjaya DiTambah.', 'success');
				} else if (this.name == 'edit') {
					Swal.fire('Berjaya!', 'Maklumat Status Berpindah Berjaya DiUbah.', 'success');
				}
				this.activeModal.close(true);
			});
	}
}
