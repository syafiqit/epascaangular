import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import { CreateOrEditRefJenisBayaranDto, RefJenisBayaranServiceProxy } from '@app/shared/proxy/service-proxies';
import { ConfirmationService } from '@app/shared/services/confirmation';

@Component({
  selector: 'app-tambah-edit-jenis-bayaran',
  templateUrl: './tambah-edit-jenis-bayaran.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class TambahEditJenisBayaranComponent implements OnInit {
  @Input() name;
	@Input() id;

	jenis_bayaran: CreateOrEditRefJenisBayaranDto = new CreateOrEditRefJenisBayaranDto();
	saving = true;

	constructor(
		public activeModal: NgbActiveModal,
    private _confirmationService: ConfirmationService,
		private _refJenisBayaranServiceProxy: RefJenisBayaranServiceProxy
	) {}

	ngOnInit(): void {
		this.show();
	}

  show() {
		if (!this.id) {
			this.jenis_bayaran = new CreateOrEditRefJenisBayaranDto();
		} else {
			this._refJenisBayaranServiceProxy.getRefJenisBayaranForEdit(this.id).subscribe((result) => {
				this.jenis_bayaran = result.ref_jenis_bayaran;
			});
		}
	}

	save(): void {
		this.saving = true;

		this._refJenisBayaranServiceProxy
			.createOrEdit(this.jenis_bayaran)
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
            message: 'Maklumat Jenis Bayaran Berjaya Ditambah.',
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
            message: 'Maklumat Jenis Bayaran Berjaya Dikemaskini.',
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
