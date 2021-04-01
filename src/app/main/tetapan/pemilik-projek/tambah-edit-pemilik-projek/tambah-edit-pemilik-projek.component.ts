import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import { CreateOrEditRefPemilikDto, RefPemilikServiceProxy } from 'src/app/shared/proxy/service-proxies';
declare let require;
const Swal = require('sweetalert2');

@Component({
	selector: 'app-tambah-edit-pemilik-projek',
	templateUrl: './tambah-edit-pemilik-projek.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TambahEditPemilikProjekComponent implements OnInit {
	@Input() name;
	@Input() id;

	pemilik: CreateOrEditRefPemilikDto = new CreateOrEditRefPemilikDto();
	saving = true;

	constructor(
		private modalService: NgbModal,
		public activeModal: NgbActiveModal,
		private _refPemilikServiceProxy: RefPemilikServiceProxy
	) {}

	ngOnInit(): void {
		this.show();
	}

	show() {
		if (!this.id) {
			this.pemilik = new CreateOrEditRefPemilikDto();
		} else {
			this._refPemilikServiceProxy.getRefPemilikForEdit(this.id).subscribe((result) => {
				this.pemilik = result.ref_pemilik;
			});
		}
	}

	save(): void {
		this.saving = true;

		this._refPemilikServiceProxy
			.createOrEdit(this.pemilik)
			.pipe(
				finalize(() => {
					this.saving = false;
				})
			)
			.subscribe(() => {
				if (this.name == 'add') {
					Swal.fire('Berjaya!', 'Maklumat Pemilik Projek Berjaya Di Tambah.', 'success');
				} else if (this.name == 'edit') {
					Swal.fire('Berjaya!', 'Maklumat Pemilik Projek Berjaya Di Ubah.', 'success');
				}
				this.activeModal.close(true);
			});
	}
}
