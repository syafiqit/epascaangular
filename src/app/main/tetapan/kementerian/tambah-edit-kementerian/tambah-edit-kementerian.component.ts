import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import { CreateOrEditRefKementerianDto, RefKementerianServiceProxy } from 'src/app/shared/proxy/service-proxies';
declare let require;
const Swal = require('sweetalert2');

@Component({
	selector: 'app-tambah-edit-kementerian',
	templateUrl: './tambah-edit-kementerian.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TambahEditKementerianComponent implements OnInit {
	@Input() name;
	@Input() id;

	kementerian: CreateOrEditRefKementerianDto = new CreateOrEditRefKementerianDto();
	saving = true;

	constructor(
		private modalService: NgbModal,
		public activeModal: NgbActiveModal,
		private _refKementerianServiceProxy: RefKementerianServiceProxy
	) {}

	ngOnInit(): void {
		this.show();
	}

	show() {
		if (!this.id) {
			this.kementerian = new CreateOrEditRefKementerianDto();
		} else {
			this._refKementerianServiceProxy.getRefKementerianForEdit(this.id).subscribe((result) => {
				this.kementerian = result.ref_kementerian;
			});
		}
	}

	save(): void {
		this.saving = true;

		this._refKementerianServiceProxy
			.createOrEdit(this.kementerian)
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
