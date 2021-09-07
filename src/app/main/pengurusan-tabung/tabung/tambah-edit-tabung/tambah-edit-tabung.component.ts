import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { CreateOrEditTabungDto, GetTabungForViewDto, TabungServiceProxy } from 'src/app/shared/proxy/service-proxies';
import { swalSuccess } from '@shared/sweet-alert/swal-constant';

@Component({
	selector: 'app-tambah-edit-tabung',
	templateUrl: './tambah-edit-tabung.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TambahEditTabungComponent implements OnInit {
	@Input() name;

  createTabung: CreateOrEditTabungDto = new CreateOrEditTabungDto();

	constructor(
    public activeModal: NgbActiveModal,
    private tabungServiceProxy: TabungServiceProxy,
    ) {}

	ngOnInit(): void {}

  save() {
    this.tabungServiceProxy.createOrEdit(this.createTabung).subscribe(()=>{
      swalSuccess.fire('Berjaya', 'Maklumat Tabung Berjaya Ditambah').then(() => {
				this.activeModal.close(true);
      });
    })
  }
}
