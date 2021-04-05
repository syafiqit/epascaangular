import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import { CreateOrEditRefJenisBencanaDto, RefJenisBencanaServiceProxy } from 'src/app/shared/proxy/service-proxies';
declare let require;
const Swal = require('sweetalert2');

@Component({
	selector: 'app-tambah-edit-bencana',
	templateUrl: './tambah-edit-bencana.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TambahEditBencanaComponent implements OnInit {
	@Input() name;
	@Input() id;

	bencana: CreateOrEditRefJenisBencanaDto = new CreateOrEditRefJenisBencanaDto();
	saving = true;

	constructor(
		private modalService: NgbModal,
		public activeModal: NgbActiveModal,
		private _refJenisBencanaServiceProxy: RefJenisBencanaServiceProxy
	) {}

	ngOnInit(): void {
		this.show();
	}

	show() {
		if (!this.id) {
			this.bencana = new CreateOrEditRefJenisBencanaDto();
		} else {
			this._refJenisBencanaServiceProxy.getRefJenisBencanaForEdit(this.id).subscribe((result) => {
				this.bencana = result.ref_jenis_bencana;
			});
		}
	}

	save(): void {
		this.saving = true;

		this._refJenisBencanaServiceProxy
			.createOrEdit(this.bencana)
			.pipe(
				finalize(() => {
					this.saving = false;
				})
			)
			.subscribe(() => {
				if (this.name == 'add') {
					Swal.fire('Berjaya!', 'Maklumat Kategori Bencana Berjaya Ditambah.', 'success');
				} else if (this.name == 'edit') {
					Swal.fire('Berjaya!', 'Maklumat Kategori Bencana Berjaya Diubah.', 'success');
				}
				this.activeModal.close(true);
			});
	}
}
