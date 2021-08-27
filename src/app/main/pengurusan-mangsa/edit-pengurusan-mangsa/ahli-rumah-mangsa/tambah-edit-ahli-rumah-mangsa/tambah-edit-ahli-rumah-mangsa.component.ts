import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import {
  CreateOrEditMangsaAirDto,
  MangsaAirServiceProxy,
  RefHubunganServiceProxy
} from 'src/app/shared/proxy/service-proxies';
import { swalSuccess } from '@shared/sweet-alert/swal-constant';

@Component({
	selector: 'app-tambah-edit-ahli-rumah-mangsa',
	templateUrl: './tambah-edit-ahli-rumah-mangsa.component.html'
})
export class TambahEditAhliRumahMangsaComponent implements OnInit {
	@Input() name;
	@Input() id;

  addAhli: CreateOrEditMangsaAirDto = new CreateOrEditMangsaAirDto();
	saving = false;
  idMangsa: number;
  relationships: any;

	constructor(
    public activeModal: NgbActiveModal,
    private _activatedRoute: ActivatedRoute,
    private _mangsaAirServiceProxy: MangsaAirServiceProxy,
    private _refHubunganServiceProxy: RefHubunganServiceProxy
  ) {
    this.idMangsa = this._activatedRoute.snapshot.queryParams['id'];
  }

	ngOnInit(): void {
    this.show();
    this.getHubungan();
  }

	show() {
		if (!this.id) {
			this.addAhli = new CreateOrEditMangsaAirDto();
		} else {
			this._mangsaAirServiceProxy.getMangsaAirForEdit(this.id).subscribe((result) => {
				this.addAhli = result.mangsa_air;
			});
		}
	}

	getHubungan(filter?) {
		this._refHubunganServiceProxy.getRefHubunganForDropdown(filter).subscribe((result) => {
			this.relationships = result.items;
		});
	}

	save(): void {
		this.saving = true;

    this.addAhli.id_mangsa = this.idMangsa;
		this._mangsaAirServiceProxy
			.createOrEdit(this.addAhli)
			.pipe(
				finalize(() => {
					this.saving = false;
				})
			)
			.subscribe(() => {
				if (this.name == 'add') {
					swalSuccess.fire('Berjaya!', 'Maklumat Ahli Isi Rumah Berjaya Ditambah.', 'success');
				} else if (this.name == 'edit') {
					swalSuccess.fire('Berjaya!', 'Maklumat Ahli Isi Rumah Berjaya Dikemaskini.', 'success');
				}
				this.activeModal.close(true);
			});
	}
}
