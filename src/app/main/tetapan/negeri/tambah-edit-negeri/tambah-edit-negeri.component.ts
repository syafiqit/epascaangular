import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { CreateOrEditRefNegeriDto, RefNegeriServiceProxy } from '../../../../shared/proxy/service-proxies';
declare let require;
const Swal = require('sweetalert2');

@Component({
	selector: 'app-tambah-edit-negeri',
	templateUrl: './tambah-edit-negeri.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TambahEditNegeriComponent implements OnInit {
	@Input() name;
	@Input() id;

	negeri: CreateOrEditRefNegeriDto = new CreateOrEditRefNegeriDto();
	saving = false;

	filterNegeri: any;
	sortingNegeri: any;
	skipCountNegeri: any;
	maxResultCountNegeri: any;
	states: any[];

	constructor(
		private modalService: NgbModal,
		public activeModal: NgbActiveModal,
		private _refNegeriServiceProxy: RefNegeriServiceProxy
	) {}

	ngOnInit(): void {
		this.getNegeri();
		this.show();
	}

	getNegeri(filter?) {
		this._refNegeriServiceProxy.getRefNegeriForDropdown(filter).subscribe((result) => {
			this.states = result.items;
		});
	}

	show() {
		if (!this.id) {
			this.negeri = new CreateOrEditRefNegeriDto();
		} else {
			this._refNegeriServiceProxy.getRefNegeriForEdit(this.id).subscribe((result) => {
				this.negeri = result.ref_negeri;
			});
		}
	}

	save(): void {
		this.saving = true;

		this._refNegeriServiceProxy
			.createOrEdit(this.negeri)
			.pipe()
			.subscribe(() => {
				if (this.name == 'add') {
					Swal.fire('Berjaya!', 'Maklumat Negeri Berjaya DiTambah.', 'success');
				} else if (this.name == 'edit') {
					Swal.fire('Berjaya!', 'Maklumat Negeri Berjaya DiUbah.', 'success');
				}
				this.activeModal.close(true);
			});
	}
}
