import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import { CreateOrEditRefPelaksanaDto, RefPelaksanaServiceProxy } from 'src/app/shared/proxy/service-proxies';
declare let require;
const Swal = require('sweetalert2');

@Component({
	selector: 'app-tambah-edit-pelaksana',
	templateUrl: './tambah-edit-pelaksana.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TambahEditPelaksanaComponent implements OnInit {
	@Input() name;
	@Input() id;

	pelaksana: CreateOrEditRefPelaksanaDto = new CreateOrEditRefPelaksanaDto();
	saving = true;

	constructor(
		private modalService: NgbModal,
		public activeModal: NgbActiveModal,
		private _refPelaksanaServiceProxy: RefPelaksanaServiceProxy
	) {}

	ngOnInit(): void {
		this.show();
	}

	show() {
		if (!this.id) {
			this.pelaksana = new CreateOrEditRefPelaksanaDto();
		} else {
			this._refPelaksanaServiceProxy.getRefPelaksanaForEdit(this.id).subscribe((result) => {
				this.pelaksana = result.ref_pelaksana;
			});
		}
	}

	save(): void {
		this.saving = true;

		this._refPelaksanaServiceProxy
			.createOrEdit(this.pelaksana)
			.pipe(
				finalize(() => {
					this.saving = false;
				})
			)
			.subscribe(() => {
				if (this.name == 'add') {
					Swal.fire('Berjaya!', 'Maklumat Kementerian Berjaya Ditambah.', 'success');
				} else if (this.name == 'edit') {
					Swal.fire('Berjaya!', 'Maklumat Kementerian Berjaya Diubah.', 'success');
				}
				this.activeModal.close(true);
			});
	}
}
