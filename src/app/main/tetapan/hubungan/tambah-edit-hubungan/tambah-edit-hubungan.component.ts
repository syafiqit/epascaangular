import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { ConfirmationService } from '@app/shared/services/confirmation';
import { NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { CreateOrEditRefHubunganDto, RefHubunganServiceProxy } from '../../../../shared/proxy/service-proxies';

@Component({
	selector: 'app-tambah-edit-hubungan',
	templateUrl: './tambah-edit-hubungan.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class TambahEditHubunganComponent implements OnInit {
	@Input() name;
	@Input() id;

	hubungan: CreateOrEditRefHubunganDto = new CreateOrEditRefHubunganDto();
	saving = false;

	states: any[];

	constructor(
		public activeModal: NgbActiveModal,
    private _confirmationService: ConfirmationService,
		private _refHubunganServiceProxy: RefHubunganServiceProxy
	) {}

	ngOnInit(): void {
		this.show();
	}

	show() {
		if (!this.id) {
			this.hubungan = new CreateOrEditRefHubunganDto();
		} else {
			this._refHubunganServiceProxy.getRefHubunganForEdit(this.id).subscribe((result) => {
				this.hubungan = result.ref_hubungan;
			});
		}
	}

	save(): void {
		this.saving = true;

		this._refHubunganServiceProxy
			.createOrEdit(this.hubungan)
			.pipe()
			.subscribe(() => {
				if (this.name == 'add') {
          const dialogRef = this._confirmationService.open({
            title: 'Berjaya',
            message: 'Maklumat Nama Hubungan Berjaya Ditambah.',
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
            message: 'Maklumat Nama Hubungan Berjaya Dikemaskini.',
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
