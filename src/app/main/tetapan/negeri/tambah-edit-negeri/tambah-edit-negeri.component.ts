import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { CreateOrEditRefNegeriDto, RefNegeriServiceProxy } from '../../../../shared/proxy/service-proxies';
import { ConfirmationService } from '@app/shared/services/confirmation';

@Component({
	selector: 'app-tambah-edit-negeri',
	templateUrl: './tambah-edit-negeri.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class TambahEditNegeriComponent implements OnInit {
	@Input() name;
	@Input() id;

	negeri: CreateOrEditRefNegeriDto = new CreateOrEditRefNegeriDto();
	saving = false;

	filterNegeri: any;
	sortingNegeri: any;
	skipCountNegeri: any;
	maxResultCountNegeri: any;
	states: any[];

	constructor(
		public activeModal: NgbActiveModal,
    private _confirmationService: ConfirmationService,
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
			this.negeri = new CreateOrEditRefNegeriDto();
		} else {
			this._refNegeriServiceProxy.getRefNegeriForEdit(this.id).subscribe((result) => {
				this.negeri = result.ref_negeri;
			});
		}
	}

	save(): void {
		this.saving = true;

		this._refNegeriServiceProxy
			.createOrEdit(this.negeri)
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
            message: 'Maklumat Negeri Berjaya Ditambah',
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
            message: 'Maklumat Negeri Berjaya Dikemaskini',
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
