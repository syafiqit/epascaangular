import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import { CreateOrEditRefTapakRumahDto, RefTapakRumahServiceProxy } from 'src/app/shared/proxy/service-proxies';
declare let require;
const Swal = require('sweetalert2');

@Component({
	selector: 'app-tambah-edit-pemilik-projek-rumah',
	templateUrl: './tambah-edit-pemilik-projek-rumah.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TambahEditPemilikProjekRumahComponent implements OnInit {
	@Input() name;
	@Input() id;

	tapak_rumah: CreateOrEditRefTapakRumahDto = new CreateOrEditRefTapakRumahDto();
	saving = true;

	constructor(
		private modalService: NgbModal,
		public activeModal: NgbActiveModal,
		private _refTapakRumahServiceProxy: RefTapakRumahServiceProxy
	) {}

	ngOnInit(): void {
		this.show();
	}

	show() {
		if (!this.id) {
			this.tapak_rumah = new CreateOrEditRefTapakRumahDto();
		} else {
			this._refTapakRumahServiceProxy.getRefTapakRumahForEdit(this.id).subscribe((result) => {
				this.tapak_rumah = result.ref_tapak_rumah;
			});
		}
	}

	save(): void {
		this.saving = true;

		this._refTapakRumahServiceProxy
			.createOrEdit(this.tapak_rumah)
			.pipe(
				finalize(() => {
					this.saving = false;
				})
			)
			.subscribe(() => {
				if (this.name == 'add') {
					Swal.fire('Berjaya!', 'Maklumat Pemilik Projek Rumah Berjaya Ditambah.', 'success');
				} else if (this.name == 'edit') {
					Swal.fire('Berjaya!', 'Maklumat Pemilik Projek Rumah Berjaya Dikemaskini.', 'success');
				}
				this.activeModal.close(true);
			});
	}
}
