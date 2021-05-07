import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import {
  CreateOrEditMangsaBencanaDto,
  MangsaBencanaServiceProxy,
  RefBencanaServiceProxy,
  RefPindahServiceProxy
} from 'src/app/shared/proxy/service-proxies';
declare let require;
const Swal = require('sweetalert2');
@Component({
	selector: 'app-tambah-edit-mangsa-bencana',
	templateUrl: './tambah-edit-mangsa-bencana.component.html'
})

export class TambahEditMangsaBencanaComponent implements OnInit {
	@Input() name;
	@Input() id;

  saving = false;
  idMangsa: number;
  disasters: any;
  evacuates: any;
  addBencana: CreateOrEditMangsaBencanaDto = new CreateOrEditMangsaBencanaDto();

	constructor(
    public activeModal: NgbActiveModal,
    private _activatedRoute: ActivatedRoute,
    private _mangsaBencanaServiceProxy: MangsaBencanaServiceProxy,
    private _refBencanaServiceProxy: RefBencanaServiceProxy,
    private _refPindahServiceProxy: RefPindahServiceProxy
  ) {
    this.idMangsa = this._activatedRoute.snapshot.queryParams['id'];
  }

	ngOnInit(): void {
    this.show();
    this.getBencana();
    this.getPindah();
  }

	show() {
		if (!this.id) {
			this.addBencana = new CreateOrEditMangsaBencanaDto();
		} else {
			this._mangsaBencanaServiceProxy.getMangsaBencanaForEdit(this.id).subscribe((result) => {
				this.addBencana = result.mangsa_bencana;
			});
		}
	}

	getBencana(filter?) {
		this._refBencanaServiceProxy.getRefBencanaForDropdown(filter).subscribe((result) => {
			this.disasters = result.items;
		});
	}

	getPindah(filter?) {
		this._refPindahServiceProxy.getRefPindahForDropdown(filter).subscribe((result) => {
			this.evacuates = result.items;
		});
	}

	save(): void {
		this.saving = true;

    this.addBencana.id_mangsa = this.idMangsa;
		this._mangsaBencanaServiceProxy
			.createOrEdit(this.addBencana)
			.pipe(
				finalize(() => {
					this.saving = false;
				})
			)
			.subscribe(() => {
				if (this.name == 'add') {
					Swal.fire('Berjaya!', 'Maklumat Bencana Berjaya Ditambah.', 'success');
				} else if (this.name == 'edit') {
					Swal.fire('Berjaya!', 'Maklumat Bencana Berjaya Dikemaskini.', 'success');
				}
				this.activeModal.close(true);
			});
	}
}
