import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import { CreateOrEditRefTapakRumahDto, RefTapakRumahServiceProxy } from 'src/app/shared/proxy/service-proxies';
import { ConfirmationService } from '@app/shared/services/confirmation';

@Component({
	selector: 'app-tambah-edit-pemilik-projek-rumah',
	templateUrl: './tambah-edit-pemilik-projek-rumah.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TambahEditPemilikProjekRumahComponent implements OnInit {
	@Input() name;
	@Input() id;

	tapak_rumah: CreateOrEditRefTapakRumahDto = new CreateOrEditRefTapakRumahDto();
	saving = true;

	constructor(
		public activeModal: NgbActiveModal,
		private _refTapakRumahServiceProxy: RefTapakRumahServiceProxy,
    private _confirmationService: ConfirmationService,
	) {}

	ngOnInit(): void {
		this.show();
	}

	show() {
		if (!this.id) {
			this.tapak_rumah = new CreateOrEditRefTapakRumahDto();
		} else {
			this._refTapakRumahServiceProxy.getRefTapakRumahForEdit(this.id).subscribe((result) => {
				this.tapak_rumah = result.ref_tapak_rumah;
			});
		}
	}

	save(): void {
		this.saving = true;

		this._refTapakRumahServiceProxy
			.createOrEdit(this.tapak_rumah)
			.pipe(
				finalize(() => {
					this.saving = false;
				})
			)
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
            message: 'Maklumat Pemilik Projek Berjaya Ditambah.',
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
            message: 'Maklumat Pemilik Projek Berjaya Dikemaskini.',
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
