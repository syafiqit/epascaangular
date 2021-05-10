import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { CreateOrEditRefSumberDanaDto, RefSumberDanaServiceProxy } from '../../../../shared/proxy/service-proxies';
declare let require;
const Swal = require('sweetalert2');

@Component({
	selector: 'app-tambah-edit-sumber-dana',
	templateUrl: './tambah-edit-sumber-dana.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TambahEditSumberDanaComponent implements OnInit {
	@Input() name;
	@Input() id;

	dana: CreateOrEditRefSumberDanaDto = new CreateOrEditRefSumberDanaDto();
	saving = false;

	states: any[];

	constructor(
		private modalService: NgbModal,
		public activeModal: NgbActiveModal,
		private _refSumberDanaServiceProxy: RefSumberDanaServiceProxy
	) {}

	ngOnInit(): void {
		this.show();
	}

	show() {
		if (!this.id) {
			this.dana = new CreateOrEditRefSumberDanaDto();
		} else {
			this._refSumberDanaServiceProxy.getRefSumberDanaForEdit(this.id).subscribe((result) => {
				this.dana = result.ref_sumber_dana;
			});
		}
	}

	save(): void {
		this.saving = true;

		this._refSumberDanaServiceProxy
			.createOrEdit(this.dana)
			.pipe()
			.subscribe(() => {
				if (this.name == 'add') {
					Swal.fire('Berjaya!', 'Maklumat Sumber Dana Berjaya Ditambah.', 'success');
				} else if (this.name == 'edit') {
					Swal.fire('Berjaya!', 'Maklumat Sumber Dana Berjaya Dikemaskini.', 'success');
				}
				this.activeModal.close(true);
			});
	}
}
