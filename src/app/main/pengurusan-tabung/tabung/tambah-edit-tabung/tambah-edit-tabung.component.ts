import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { CreateOrEditTabungDto, TabungServiceProxy } from 'src/app/shared/proxy/service-proxies';
import { ConfirmationService } from '@services/confirmation';
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
    private _confirmationService: ConfirmationService
    ) {}

	ngOnInit(): void {}

  save() {
    this.tabungServiceProxy.createOrEdit(this.createTabung).subscribe((result)=>{
      const dialogRef = this._confirmationService.open({
        title: 'Berjaya',
        message: 'Maklumat Tabung Berjaya Ditambah.',
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
    })
  }
}
