import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { ConfirmationService } from '@app/shared/services/confirmation';
import { NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import { CreateOrEditRefPelaksanaDto, RefPelaksanaServiceProxy } from 'src/app/shared/proxy/service-proxies';

@Component({
	selector: 'app-tambah-edit-pelaksana',
	templateUrl: './tambah-edit-pelaksana.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class TambahEditPelaksanaComponent implements OnInit {
	@Input() name;
	@Input() id;

	pelaksana: CreateOrEditRefPelaksanaDto = new CreateOrEditRefPelaksanaDto();
	saving = true;

	constructor(
		public activeModal: NgbActiveModal,
    private _confirmationService: ConfirmationService,
		private _refPelaksanaServiceProxy: RefPelaksanaServiceProxy
	) {}

	ngOnInit(): void {
		this.show();
	}

	show() {
		if (!this.id) {
			this.pelaksana = new CreateOrEditRefPelaksanaDto();
		} else {
			this._refPelaksanaServiceProxy.getRefPelaksanaForEdit(this.id).subscribe((result) => {
				this.pelaksana = result.ref_pelaksana;
			});
		}
	}

	save(): void {
		this.saving = true;

		this._refPelaksanaServiceProxy
			.createOrEdit(this.pelaksana)
			.pipe(
				finalize(() => {
					this.saving = false;
				})
			)
			.subscribe(() => {
				if (this.name == 'add') {
          const dialogRef = this._confirmationService.open({
            title: 'Berjaya',
            message: 'Maklumat Pelaksana Berjaya Ditambah.',
            icon: {
              show: true,
              name: 'check-circle',
              color: 'success'
            },
            actions: {
              confirm: {
                show: true,
                label: 'Tutup',
                color: 'primary'
              },
              cancel: {
                show: false
              }
            },
            dismissible: true
          });
          dialogRef.afterClosed().subscribe(() => {
            this.activeModal.close(true);
          });
				} else if (this.name == 'edit') {
          const dialogRef = this._confirmationService.open({
            title: 'Berjaya',
            message: 'Maklumat Pelaksana Berjaya Dikemaskini.',
            icon: {
              show: true,
              name: 'check-circle',
              color: 'success'
            },
            actions: {
              confirm: {
                show: true,
                label: 'Tutup',
                color: 'primary'
              },
              cancel: {
                show: false
              }
            },
            dismissible: true
          });
          dialogRef.afterClosed().subscribe(() => {
            this.activeModal.close(true);
          });
				}
			});
	}
}
