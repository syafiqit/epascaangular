import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import {
	CreateOrEditRefAgensiDto,
	RefAgensiServiceProxy,
	RefKementerianServiceProxy
} from 'src/app/shared/proxy/service-proxies';
import { swalSuccess } from '@shared/sweet-alert/swal-constant';

@Component({
	selector: 'app-tambah-edit-agensi',
	templateUrl: './tambah-edit-agensi.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TambahEditAgensiComponent implements OnInit {
	@Input() name;
	@Input() id;

	agensi: CreateOrEditRefAgensiDto = new CreateOrEditRefAgensiDto();
	saving = true;
	ministries: any;

	constructor(
		private modalService: NgbModal,
		public activeModal: NgbActiveModal,
		private _refAgensiServiceProxy: RefAgensiServiceProxy,
		private _refKementerianServiceProxy: RefKementerianServiceProxy
	) {}

	ngOnInit(): void {
		this.show();
		this.getKementerian();
	}

	getKementerian(filter?) {
		this._refKementerianServiceProxy.getRefKementerianForDropdown(filter).subscribe((result) => {
			this.ministries = result.items;
		});
	}

	show() {
		if (!this.id) {
			this.agensi = new CreateOrEditRefAgensiDto();
		} else {
			this._refAgensiServiceProxy.getRefAgensiForEdit(this.id).subscribe((result) => {
				this.agensi = result.ref_agensi;
			});
		}
	}

	save(): void {
		this.saving = true;

		this._refAgensiServiceProxy
			.createOrEdit(this.agensi)
			.pipe(
				finalize(() => {
					this.saving = false;
				})
			)
			.subscribe(() => {
				if (this.name == 'add') {
					swalSuccess.fire('Berjaya!', 'Maklumat Agensi Berjaya Ditambah.', 'success');
				} else if (this.name == 'edit') {
					swalSuccess.fire('Berjaya!', 'Maklumat Agensi Berjaya Dikemaskini.', 'success');
				}
				this.activeModal.close(true);
			});
	}
}
