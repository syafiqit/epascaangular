import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import { swalSuccess } from '@shared/sweet-alert/swal-constant';
import { CreateOrEditRefJenisBayaranDto, RefJenisBayaranServiceProxy } from '@app/shared/proxy/service-proxies';

@Component({
  selector: 'app-tambah-edit-jenis-bayaran',
  templateUrl: './tambah-edit-jenis-bayaran.component.html'
})
export class TambahEditJenisBayaranComponent implements OnInit {
  @Input() name;
	@Input() id;

	jenis_bayaran: CreateOrEditRefJenisBayaranDto = new CreateOrEditRefJenisBayaranDto();
	saving = true;

	constructor(
		private modalService: NgbModal,
		public activeModal: NgbActiveModal,
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
			.subscribe(() => {
				if (this.name == 'add') {
					swalSuccess.fire('Berjaya!', 'Maklumat Jenis Bayaran Berjaya Ditambah.', 'success');
				} else if (this.name == 'edit') {
					swalSuccess.fire('Berjaya!', 'Maklumat Jenis Bayaran Berjaya Dikemaskini.', 'success');
				}
				this.activeModal.close(true);
			});
	}

}
