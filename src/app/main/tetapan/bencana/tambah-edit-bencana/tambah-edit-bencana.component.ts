import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { ConfirmationService } from '@app/shared/services/confirmation';
import { NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import { CreateOrEditRefJenisBencanaDto, RefJenisBencanaServiceProxy } from 'src/app/shared/proxy/service-proxies';

@Component({
	selector: 'app-tambah-edit-bencana',
	templateUrl: './tambah-edit-bencana.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class TambahEditBencanaComponent implements OnInit {
	@Input() name;
	@Input() id;

	bencana: CreateOrEditRefJenisBencanaDto = new CreateOrEditRefJenisBencanaDto();
	saving = true;

	constructor(
		public activeModal: NgbActiveModal,
    private _confirmationService: ConfirmationService,
		private _refJenisBencanaServiceProxy: RefJenisBencanaServiceProxy
	) {}

	ngOnInit(): void {
		this.show();
	}

	show() {
		if (!this.id) {
			this.bencana = new CreateOrEditRefJenisBencanaDto();
		} else {
			this._refJenisBencanaServiceProxy.getRefJenisBencanaForEdit(this.id).subscribe((result) => {
				this.bencana = result.ref_jenis_bencana;
			});
		}
	}

	save(): void {
		this.saving = true;

		this._refJenisBencanaServiceProxy
			.createOrEdit(this.bencana)
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
            message: 'Maklumat Kategori Bencana Berjaya Ditambah.',
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
            message: 'Maklumat Kategori Bencana Berjaya Dikemaskini.',
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
