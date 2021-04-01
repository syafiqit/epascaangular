import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import {
	CreateOrEditRefPinjamanPerniagaanDto,
	RefPinjamanPerniagaanServiceProxy
} from '../../../../shared/proxy/service-proxies';
declare let require;
const Swal = require('sweetalert2');

@Component({
	selector: 'app-tambah-edit-pinjaman-usahawan',
	templateUrl: './tambah-edit-pinjaman-usahawan.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TambahEditPinjamanUsahawanComponent implements OnInit {
	@Input() name;
	@Input() id;

	pinjaman: CreateOrEditRefPinjamanPerniagaanDto = new CreateOrEditRefPinjamanPerniagaanDto();
	saving = false;

	states: any[];

	constructor(
		private modalService: NgbModal,
		public activeModal: NgbActiveModal,
		private _refPinjamanPerniagaanServiceProxy: RefPinjamanPerniagaanServiceProxy
	) {}

	ngOnInit(): void {
		this.show();
	}

	show() {
		if (!this.id) {
			this.pinjaman = new CreateOrEditRefPinjamanPerniagaanDto();
		} else {
			this._refPinjamanPerniagaanServiceProxy.getRefPinjamanPerniagaanForEdit(this.id).subscribe((result) => {
				this.pinjaman = result.ref_pinjaman_perniagaan;
			});
		}
	}

	save(): void {
		this.saving = true;

		this._refPinjamanPerniagaanServiceProxy
			.createOrEdit(this.pinjaman)
			.pipe()
			.subscribe(() => {
				if (this.name == 'add') {
					Swal.fire('Berjaya!', 'Maklumat Pinjaman Usahawan Berjaya Di Tambah.', 'success');
				} else if (this.name == 'edit') {
					Swal.fire('Berjaya!', 'Maklumat Pinjaman Usahawan Berjaya Di Ubah.', 'success');
				}
				this.activeModal.close(true);
			});
	}
}
