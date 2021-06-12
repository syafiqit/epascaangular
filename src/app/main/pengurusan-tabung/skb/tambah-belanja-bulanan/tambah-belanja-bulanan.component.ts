import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import {
	CreateOrEditTabungBayaranSkbBulananDto,
  TabungBayaranSkbBulananServiceProxy
} from 'src/app/shared/proxy/service-proxies';
declare let require;
const Swal = require('sweetalert2');

@Component({
	selector: 'app-tambah-belanja-bulanan',
	templateUrl: './tambah-belanja-bulanan.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class TambahEditAgensiComponent implements OnInit {
	@Input() name;
	@Input() id;

	skbBulanan: CreateOrEditTabungBayaranSkbBulananDto = new CreateOrEditTabungBayaranSkbBulananDto();
	saving = true;

	constructor(
		public activeModal: NgbActiveModal,
    private _tabungBayaranSkbBulananServiceProxy: TabungBayaranSkbBulananServiceProxy
	) {}

	ngOnInit(): void {
		this.show();
	}

	show() {
		if (!this.id) {
			this.skbBulanan = new CreateOrEditTabungBayaranSkbBulananDto();
		} else {
			this._tabungBayaranSkbBulananServiceProxy.getTabungBayaranSkbBulananForEdit(this.id).subscribe((result) => {
				this.skbBulanan = result.tabung_bayaran_skb_bulanan;
			});
		}
	}

	save(): void {
		this.saving = true;

		this._tabungBayaranSkbBulananServiceProxy
			.createOrEdit(this.skbBulanan)
			.pipe(
				finalize(() => {
					this.saving = false;
				})
			)
			.subscribe(() => {
				if (this.name == 'add') {
					Swal.fire('Berjaya!', 'Maklumat Belanja Bulanan Berjaya Ditambah.', 'success');
				} else if (this.name == 'edit') {
					Swal.fire('Berjaya!', 'Maklumat Belanja Bulanan Berjaya Dikemaskini.', 'success');
				}
				this.activeModal.close(true);
			});
	}
}
