import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import {
	CreateOrEditRefDaerahDto,
	RefDaerahServiceProxy,
	RefNegeriServiceProxy
} from '../../../../shared/proxy/service-proxies';
import { finalize } from 'rxjs/operators';
import { swalSuccess } from '@shared/sweet-alert/swal-constant';

@Component({
	selector: 'app-tambah-edit-daerah',
	templateUrl: './tambah-edit-daerah.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TambahEditDaerahComponent implements OnInit {
	@Input() name;
	@Input() id;

	daerah: CreateOrEditRefDaerahDto = new CreateOrEditRefDaerahDto();
	saving = false;

	filter: any;
	dropdownFilter: any;
	states: any;

	constructor(
		private modalService: NgbModal,
		public activeModal: NgbActiveModal,
		private _refDaerahServiceProxy: RefDaerahServiceProxy,
		private _refNegeriServiceProxy: RefNegeriServiceProxy
	) {}

	ngOnInit(): void {
		this.show();
		this.getNegeri();
	}

	getNegeri(filter?) {
		this._refNegeriServiceProxy.getRefNegeriForDropdown(filter).subscribe((result) => {
			this.states = result.items;
		});
	}

	show() {
		if (!this.id) {
			this.daerah = new CreateOrEditRefDaerahDto();
		} else {
			this._refDaerahServiceProxy.getRefDaerahForEdit(this.id).subscribe((result) => {
				this.daerah = result.ref_daerah;
			});
		}
	}

	save(): void {
		this.saving = true;
		this.daerah.id = 1;

		this._refDaerahServiceProxy
			.createOrEdit(this.daerah)
			.pipe(
				finalize(() => {
					this.saving = false;
				})
			)
			.subscribe(() => {
				if (this.name == 'add') {
					swalSuccess.fire('Berjaya!', 'Maklumat Daerah Berjaya Ditambah.', 'success');
				} else if (this.name == 'edit') {
					swalSuccess.fire('Berjaya!', 'Maklumat Daerah Berjaya Dikemaskini.', 'success');
				}
				this.activeModal.close(true);
			});
	}
}
