import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { ConfirmationService } from '@app/shared/services/confirmation';
import { NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { CreateOrEditRefKerosakanDto, RefKerosakanServiceProxy } from '../../../../shared/proxy/service-proxies';

@Component({
	selector: 'app-tambah-edit-kerosakan-rumah',
	templateUrl: './tambah-edit-kerosakan-rumah.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class TambahEditKerosakanRumahComponent implements OnInit {
	@Input() name;
	@Input() id;

	kerosakan: CreateOrEditRefKerosakanDto = new CreateOrEditRefKerosakanDto();
	saving = false;

	states: any[];

	constructor(
		public activeModal: NgbActiveModal,
    private _confirmationService: ConfirmationService,
		private _refKerosakanServiceProxy: RefKerosakanServiceProxy
	) {}

	ngOnInit(): void {
		this.show();
	}

	show() {
		if (!this.id) {
			this.kerosakan = new CreateOrEditRefKerosakanDto();
		} else {
			this._refKerosakanServiceProxy.getRefKerosakanForEdit(this.id).subscribe((result) => {
				this.kerosakan = result.ref_kerosakan;
			});
		}
	}

	save(): void {
		this.saving = true;

		this._refKerosakanServiceProxy
			.createOrEdit(this.kerosakan)
			.pipe()
			.subscribe((result) => {
        if(result.message){
          this._confirmationService.open({
            title: 'Tidak Berjaya',
            message: result.message,
            icon: {
              show: true,
              name: 'x-circle',
              color: 'error'
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
        }
				else if (this.name == 'add') {
          const dialogRef = this._confirmationService.open({
            title: 'Berjaya',
            message: 'Maklumat Kerosakan Rumah Berjaya Ditambah.',
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
            message: 'Maklumat Kerosakan Rumah Berjaya Dikemaskini.',
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
