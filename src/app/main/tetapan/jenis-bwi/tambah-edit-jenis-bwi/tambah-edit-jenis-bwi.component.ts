import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { CreateOrEditRefJenisBwiDto, RefJenisBwiServiceProxy } from '@app/shared/proxy/service-proxies';
import { ConfirmationService } from '@app/shared/services/confirmation';
import { NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-tambah-edit-jenis-bwi',
	templateUrl: './tambah-edit-jenis-bwi.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class TambahEditJenisBwiComponent implements OnInit {
	@Input() name;
	@Input() id;

	jenis_bwi: CreateOrEditRefJenisBwiDto = new CreateOrEditRefJenisBwiDto();
	saving = false;

	constructor(
		public activeModal: NgbActiveModal,
    private _confirmationService: ConfirmationService,
    private _refJenisBwiServiceProxy: RefJenisBwiServiceProxy
	) {}

	ngOnInit(): void {
		this.show();
	}

	show() {
		if (!this.id) {
			this.jenis_bwi = new CreateOrEditRefJenisBwiDto();
		} else {
			this._refJenisBwiServiceProxy.getRefJenisBwiForEdit(this.id).subscribe((result) => {
				this.jenis_bwi = result.ref_jenis_bwi;
			});
		}
	}

	save(): void {
		this.saving = true;

		this._refJenisBwiServiceProxy
			.createOrEdit(this.jenis_bwi)
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
            message: 'Maklumat Jenis Bantuan Wang Ihsan Berjaya Ditambah',
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
            message: 'Maklumat Jenis Bantuan Wang Ihsan Berjaya Dikemaskini',
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
