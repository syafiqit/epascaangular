import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { CreateOrEditRefJenisPertanianDto, RefJenisPertanianServiceProxy } from '@shared/proxy/service-proxies';
import { ConfirmationService } from '@app/shared/services/confirmation';
import { finalize } from 'rxjs/operators';

@Component({
	selector: 'app-tambah-edit-jenis-pertanian',
	templateUrl: './tambah-edit-jenis-pertanian.component.html',
	encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, RefJenisPertanianServiceProxy]
})
export class TambahEditJenisPertanianComponent implements OnInit {
	@Input() name;
	@Input() id;

	jenis_pertanian: CreateOrEditRefJenisPertanianDto = new CreateOrEditRefJenisPertanianDto();
	saving = true;

	constructor(
		public activeModal: NgbActiveModal,
    private _confirmationService: ConfirmationService,
		private _refJenisPertanianServiceProxy: RefJenisPertanianServiceProxy
	) {}

	ngOnInit(): void {
		this.show();
	}

	show() {
		if (!this.id) {
			this.jenis_pertanian = new CreateOrEditRefJenisPertanianDto();
		} else {
			this._refJenisPertanianServiceProxy.getRefJenisPertanianForEdit(this.id).subscribe((result) => {
				this.jenis_pertanian = result.ref_jenis_pertanian;
			});
		}
	}

	save(): void {
		this.saving = true;

		this._refJenisPertanianServiceProxy
			.createOrEdit(this.jenis_pertanian)
			.pipe(
				finalize(() => {
					this.saving = false;
				})
			)
			.subscribe(() => {
				if (this.name == 'add') {
          const dialogRef = this._confirmationService.open({
            title: 'Berjaya',
            message: 'Maklumat Kadar Bantuan Wang Ihsan Berjaya Ditambah.',
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
            message: 'Maklumat Kadar Bantuan Wang Ihsan Berjaya Dikemaskini.',
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
