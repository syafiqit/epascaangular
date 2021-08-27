import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
	CreateOrEditRefDunDto,
	RefDunServiceProxy,
	RefNegeriServiceProxy,
	RefParlimenServiceProxy
} from '../../../../shared/proxy/service-proxies';
import { swalSuccess } from '@shared/sweet-alert/swal-constant';

@Component({
	selector: 'app-tambah-edit-dun',
	templateUrl: './tambah-edit-dun.component.html'
})
export class TambahEditDunComponent implements OnInit {
	@Input() name;
	@Input() id;

	dun: CreateOrEditRefDunDto = new CreateOrEditRefDunDto();
	saving = false;
	states: any[];
	parliament: any[];

	constructor(
		private modalService: NgbModal,
		public activeModal: NgbActiveModal,
		private _refDunServiceProxy: RefDunServiceProxy,
		private _refNegeriServiceProxy: RefNegeriServiceProxy,
		private _refParlimenServiceProxy: RefParlimenServiceProxy
	) {}

	ngOnInit(): void {
		this.show();
		this.getNegeri();
		this.getParlimen();
	}

	getParlimen(filter?) {
		this._refParlimenServiceProxy.getRefParlimenForDropdown(filter).subscribe((result) => {
			this.parliament = result.items;
		});
	}

	getNegeri(filter?) {
		this._refNegeriServiceProxy.getRefNegeriForDropdown(filter).subscribe((result) => {
			this.states = result.items;
		});
	}

	show() {
		if (!this.id) {
			this.dun = new CreateOrEditRefDunDto();
		} else {
			this._refDunServiceProxy.getRefDunForEdit(this.id).subscribe((result) => {
				this.dun = result.ref_dun;
			});
		}
	}

	save(): void {
		this.saving = true;

		this._refDunServiceProxy
			.createOrEdit(this.dun)
			.pipe()
			.subscribe(() => {
				if (this.name == 'add') {
					swalSuccess.fire('Berjaya!', 'Maklumat Dun Berjaya Ditambah.', 'success');
				} else if (this.name == 'edit') {
					swalSuccess.fire('Berjaya!', 'Maklumat Dun Berjaya Dikemaskini.', 'success');
				}
				this.activeModal.close(true);
			});
	}
}
