import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ConfirmationService } from '@app/shared/services/confirmation';
import { NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import {
	CreateOrEditRefParlimenDto,
	RefNegeriServiceProxy,
	RefParlimenServiceProxy
} from '../../../../shared/proxy/service-proxies';

@Component({
	selector: 'app-tambah-edit-parlimen',
	templateUrl: './tambah-edit-parlimen.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class TambahEditParlimenComponent implements OnInit {
	@Input() name;
	@Input() id;

	parlimen: CreateOrEditRefParlimenDto = new CreateOrEditRefParlimenDto();
	saving = false;

	filterNegeri: any;
	sortingNegeri: any;
	skipCountNegeri: any;
	maxResultCountNegeri: any;
	states: any[];

	constructor(
		public activeModal: NgbActiveModal,
    private _confirmationService: ConfirmationService,
		private _refParlimenServiceProxy: RefParlimenServiceProxy,
		private _refNegeriServiceProxy: RefNegeriServiceProxy
	) {}

	ngOnInit(): void {
		this.getNegeri();
		this.show();
	}

	getNegeri(filter?) {
		this._refNegeriServiceProxy.getRefNegeriForDropdown(filter).subscribe((result) => {
			this.states = result.items;
		});
	}

	show() {
		if (!this.id) {
			this.parlimen = new CreateOrEditRefParlimenDto();
		} else {
			this._refParlimenServiceProxy.getRefParlimenForEdit(this.id).subscribe((result) => {
				this.parlimen = result.ref_parlimen;
			});
		}
	}

	save(): void {
		this.saving = true;

		this._refParlimenServiceProxy
			.createOrEdit(this.parlimen)
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
            message: 'Maklumat Parlimen Berjaya Ditambah',
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
            message: 'Maklumat Parlimen Berjaya Dikemaskini',
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
