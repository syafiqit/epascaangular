import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { ConfirmationService } from '@app/shared/services/confirmation';
import { NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import {
	CreateOrEditRefPinjamanPerniagaanDto,
	RefPinjamanPerniagaanServiceProxy
} from '../../../../shared/proxy/service-proxies';

@Component({
	selector: 'app-tambah-edit-pinjaman-usahawan',
	templateUrl: './tambah-edit-pinjaman-usahawan.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class TambahEditPinjamanUsahawanComponent implements OnInit {
	@Input() name;
	@Input() id;

	pinjaman: CreateOrEditRefPinjamanPerniagaanDto = new CreateOrEditRefPinjamanPerniagaanDto();
	saving = false;

	states: any[];

	constructor(
		public activeModal: NgbActiveModal,
    private _confirmationService: ConfirmationService,
		private _refPinjamanPerniagaanServiceProxy: RefPinjamanPerniagaanServiceProxy
	) {}

	ngOnInit(): void {
		this.show();
	}

	show() {
		if (!this.id) {
			this.pinjaman = new CreateOrEditRefPinjamanPerniagaanDto();
		} else {
			this._refPinjamanPerniagaanServiceProxy.getRefPinjamanPerniagaanForEdit(this.id).subscribe((result) => {
				this.pinjaman = result.ref_pinjaman_perniagaan;
			});
		}
	}

	save(): void {
		this.saving = true;

		this._refPinjamanPerniagaanServiceProxy
			.createOrEdit(this.pinjaman)
			.pipe()
			.subscribe(() => {
				if (this.name == 'add') {
          const dialogRef = this._confirmationService.open({
            title: 'Berjaya',
            message: 'Maklumat Pinjaman Usahawan Berjaya Ditambah.',
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
            message: 'Maklumat Pinjaman Usahawan Berjaya Dikemaskini.',
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
