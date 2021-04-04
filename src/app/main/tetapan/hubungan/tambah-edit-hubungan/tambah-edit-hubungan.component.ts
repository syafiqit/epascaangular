import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { CreateOrEditRefHubunganDto, RefHubunganServiceProxy } from '../../../../shared/proxy/service-proxies';
declare let require;
const Swal = require('sweetalert2');

@Component({
	selector: 'app-tambah-edit-hubungan',
	templateUrl: './tambah-edit-hubungan.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TambahEditHubunganComponent implements OnInit {
	@Input() name;
	@Input() id;

	hubungan: CreateOrEditRefHubunganDto = new CreateOrEditRefHubunganDto();
	saving = false;

	states: any[];

	constructor(
		private modalService: NgbModal,
		public activeModal: NgbActiveModal,
		private _refHubunganServiceProxy: RefHubunganServiceProxy
	) {}

	ngOnInit(): void {
		this.show();
	}

	show() {
		if (!this.id) {
			this.hubungan = new CreateOrEditRefHubunganDto();
		} else {
			this._refHubunganServiceProxy.getRefHubunganForEdit(this.id).subscribe((result) => {
				this.hubungan = result.ref_hubungan;
			});
		}
	}

	save(): void {
		this.saving = true;

		this._refHubunganServiceProxy
			.createOrEdit(this.hubungan)
			.pipe()
			.subscribe(() => {
				if (this.name == 'add') {
					Swal.fire('Berjaya!', 'Maklumat Nama Hubungan Berjaya DiTambah.', 'success');
				} else if (this.name == 'edit') {
					Swal.fire('Berjaya!', 'Maklumat Nama Hubungan Berjaya DiUbah.', 'success');
				}
				this.activeModal.close(true);
			});
	}
}
