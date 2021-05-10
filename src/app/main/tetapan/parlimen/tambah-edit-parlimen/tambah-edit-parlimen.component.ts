import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import {
	CreateOrEditRefParlimenDto,
	RefNegeriServiceProxy,
	RefParlimenServiceProxy
} from '../../../../shared/proxy/service-proxies';
declare let require;
const Swal = require('sweetalert2');

@Component({
	selector: 'app-tambah-edit-parlimen',
	templateUrl: './tambah-edit-parlimen.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TambahEditParlimenComponent implements OnInit {
	@Input() name;
	@Input() id;

	parlimen: CreateOrEditRefParlimenDto = new CreateOrEditRefParlimenDto();
	saving = false;

	filterNegeri: any;
	sortingNegeri: any;
	skipCountNegeri: any;
	maxResultCountNegeri: any;
	states: any[];

	constructor(
		private modalService: NgbModal,
		public activeModal: NgbActiveModal,
		private _refParlimenServiceProxy: RefParlimenServiceProxy,
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
			this.parlimen = new CreateOrEditRefParlimenDto();
		} else {
			this._refParlimenServiceProxy.getRefParlimenForEdit(this.id).subscribe((result) => {
				this.parlimen = result.ref_parlimen;
			});
		}
	}

	save(): void {
		this.saving = true;

		this._refParlimenServiceProxy
			.createOrEdit(this.parlimen)
			.pipe()
			.subscribe(() => {
				if (this.name == 'add') {
					Swal.fire('Berjaya!', 'Maklumat Parlimen Berjaya Ditambah.', 'success');
				} else if (this.name == 'edit') {
					Swal.fire('Berjaya!', 'Maklumat Parlimen Berjaya Dikemaskini.', 'success');
				}
				this.activeModal.close(true);
			});
	}
}
