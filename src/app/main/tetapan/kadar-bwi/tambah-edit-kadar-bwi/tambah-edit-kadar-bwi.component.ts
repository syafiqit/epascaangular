import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { CreateOrEditRefKadarBwiDto, RefKadarBwiServiceProxy } from '@app/shared/proxy/service-proxies';
import { ConfirmationService } from '@app/shared/services/confirmation';
import { NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';

@Component({
	selector: 'app-tambah-edit-kadar-bwi',
	templateUrl: './tambah-edit-kadar-bwi.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, RefKadarBwiServiceProxy]
})
export class TambahEditKadarBwiComponent implements OnInit {
	@Input() name;
	@Input() id;

	kadar_bwi: CreateOrEditRefKadarBwiDto = new CreateOrEditRefKadarBwiDto();
	saving = true;

	constructor(
		public activeModal: NgbActiveModal,
    private _confirmationService: ConfirmationService,
		private _refKadarBwiServiceProxy: RefKadarBwiServiceProxy
	) {}

	ngOnInit(): void {
		this.show();
	}

	show() {
		if (!this.id) {
			this.kadar_bwi = new CreateOrEditRefKadarBwiDto();
		} else {
			this._refKadarBwiServiceProxy.getRefKadarBwiForEdit(this.id).subscribe((result) => {
				this.kadar_bwi = result.ref_kadar_bwi;
			});
		}
	}

	save(): void {
		this.saving = true;

		this._refKadarBwiServiceProxy
			.createOrEdit(this.kadar_bwi)
			.pipe(
				finalize(() => {
					this.saving = false;
				})
			)
			.subscribe(() => {
				if (this.name == 'add') {
          const dialogRef = this._confirmationService.open({
            title: 'Berjaya',
            message: 'Maklumat Kadar Bantuan Wang Ihsan Berjaya Ditambah',
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
            message: 'Maklumat Kadar Bantuan Wang Ihsan Berjaya Dikemaskini',
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
