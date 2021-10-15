import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { ConfirmationService } from '@app/shared/services/confirmation';
import { NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import {
	CreateOrEditRefDunDto,
	RefDunServiceProxy,
	RefNegeriServiceProxy,
	RefParlimenServiceProxy
} from '../../../../shared/proxy/service-proxies';


@Component({
	selector: 'app-tambah-edit-dun',
	templateUrl: './tambah-edit-dun.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class TambahEditDunComponent implements OnInit {
	@Input() name;
	@Input() id;

	dun: CreateOrEditRefDunDto = new CreateOrEditRefDunDto();
	saving = false;
	states: any[];
	parliament: any[];

	constructor(
		public activeModal: NgbActiveModal,
		private _refDunServiceProxy: RefDunServiceProxy,
    private _confirmationService: ConfirmationService,
		private _refNegeriServiceProxy: RefNegeriServiceProxy,
		private _refParlimenServiceProxy: RefParlimenServiceProxy
	) {}

	ngOnInit(): void {
		this.show();
		this.getNegeri();
		this.getParlimen();
	}

	getParlimen(filter?) {
		this._refParlimenServiceProxy.getRefParlimenForDropdown(filter).subscribe((result) => {
			this.parliament = result.items;
		});
	}

	getNegeri(filter?) {
		this._refNegeriServiceProxy.getRefNegeriForDropdown(filter).subscribe((result) => {
			this.states = result.items;
		});
	}

	show() {
		if (!this.id) {
			this.dun = new CreateOrEditRefDunDto();
		} else {
			this._refDunServiceProxy.getRefDunForEdit(this.id).subscribe((result) => {
				this.dun = result.ref_dun;
			});
		}
	}

	save(): void {
		this.saving = true;

		this._refDunServiceProxy
			.createOrEdit(this.dun)
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
            message: 'Maklumat Dun Berjaya Ditambah.',
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
            message: 'Maklumat Dun Berjaya Dikemaskini.',
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
