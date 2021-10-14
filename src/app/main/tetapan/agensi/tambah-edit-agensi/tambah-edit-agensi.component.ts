import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import {
	CreateOrEditRefAgensiDto,
	RefAgensiServiceProxy,
	RefKementerianServiceProxy
} from 'src/app/shared/proxy/service-proxies';
import { ConfirmationService } from '@app/shared/services/confirmation';

@Component({
	selector: 'app-tambah-edit-agensi',
	templateUrl: './tambah-edit-agensi.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class TambahEditAgensiComponent implements OnInit {
	@Input() name;
	@Input() id;

	agensi: CreateOrEditRefAgensiDto = new CreateOrEditRefAgensiDto();
	saving = true;
	ministries: any;

	constructor(
		public activeModal: NgbActiveModal,
    private _confirmationService: ConfirmationService,
		private _refAgensiServiceProxy: RefAgensiServiceProxy,
		private _refKementerianServiceProxy: RefKementerianServiceProxy
	) {}

	ngOnInit(): void {
		this.show();
		this.getKementerian();
	}

	getKementerian(filter?) {
		this._refKementerianServiceProxy.getRefKementerianForDropdown(filter).subscribe((result) => {
			this.ministries = result.items;
		});
	}

	show() {
		if (!this.id) {
			this.agensi = new CreateOrEditRefAgensiDto();
		} else {
			this._refAgensiServiceProxy.getRefAgensiForEdit(this.id).subscribe((result) => {
				this.agensi = result.ref_agensi;
			});
		}
	}

	save(): void {
		this.saving = true;

		this._refAgensiServiceProxy
			.createOrEdit(this.agensi)
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
            message: 'Maklumat Agensi Berjaya Ditambah.',
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
            message: 'Maklumat Agensi Berjaya Dikemaskini.',
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
