import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import { CreateOrEditRefKementerianDto, RefKementerianServiceProxy } from 'src/app/shared/proxy/service-proxies';
import { ConfirmationService } from '@app/shared/services/confirmation';

@Component({
	selector: 'app-tambah-edit-kementerian',
	templateUrl: './tambah-edit-kementerian.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class TambahEditKementerianComponent implements OnInit {
	@Input() name;
	@Input() id;

	kementerian: CreateOrEditRefKementerianDto = new CreateOrEditRefKementerianDto();
	saving = true;

	constructor(
		public activeModal: NgbActiveModal,
    private _confirmationService: ConfirmationService,
		private _refKementerianServiceProxy: RefKementerianServiceProxy
	) {}

	ngOnInit(): void {
		this.show();
	}

	show() {
		if (!this.id) {
			this.kementerian = new CreateOrEditRefKementerianDto();
		} else {
			this._refKementerianServiceProxy.getRefKementerianForEdit(this.id).subscribe((result) => {
				this.kementerian = result.ref_kementerian;
			});
		}
	}

	save(): void {
		this.saving = true;

		this._refKementerianServiceProxy
			.createOrEdit(this.kementerian)
			.pipe(
				finalize(() => {
					this.saving = false;
				})
			)
			.subscribe(() => {
				if (this.name == 'add') {
          const dialogRef = this._confirmationService.open({
            title: 'Berjaya',
            message: 'Maklumat Kementerian Berjaya Ditambah.',
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
            message: 'Maklumat Kementerian Berjaya Dikemaskini.',
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
