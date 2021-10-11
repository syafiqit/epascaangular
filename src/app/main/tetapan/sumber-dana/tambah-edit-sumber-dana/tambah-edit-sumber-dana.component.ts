import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { ConfirmationService } from '@app/shared/services/confirmation';
import { NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { CreateOrEditRefSumberDanaDto, RefSumberDanaServiceProxy } from '../../../../shared/proxy/service-proxies';

@Component({
	selector: 'app-tambah-edit-sumber-dana',
	templateUrl: './tambah-edit-sumber-dana.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class TambahEditSumberDanaComponent implements OnInit {
	@Input() name;
	@Input() id;

	dana: CreateOrEditRefSumberDanaDto = new CreateOrEditRefSumberDanaDto();
	saving = false;

	states: any[];

	constructor(
		public activeModal: NgbActiveModal,
    private _confirmationService: ConfirmationService,
		private _refSumberDanaServiceProxy: RefSumberDanaServiceProxy
	) {}

	ngOnInit(): void {
		this.show();
	}

	show() {
		if (!this.id) {
			this.dana = new CreateOrEditRefSumberDanaDto();
		} else {
			this._refSumberDanaServiceProxy.getRefSumberDanaForEdit(this.id).subscribe((result) => {
				this.dana = result.ref_sumber_dana;
			});
		}
	}

	save(): void {
		this.saving = true;

		this._refSumberDanaServiceProxy
			.createOrEdit(this.dana)
			.pipe()
			.subscribe(() => {
				if (this.name == 'add') {
          const dialogRef = this._confirmationService.open({
            title: 'Berjaya',
            message: 'Maklumat Sumber Dana Berjaya Ditambah.',
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
            message: 'Maklumat Sumber Dana Berjaya Dikemaskini.',
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
