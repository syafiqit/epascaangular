import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { CreateOrEditTabungDto, TabungServiceProxy } from 'src/app/shared/proxy/service-proxies';
import { ConfirmationService } from '@services/confirmation';
import { CurrencyPipe } from '@angular/common';

@Component({
	selector: 'app-tambah-edit-tabung',
	templateUrl: './tambah-edit-tabung.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TambahEditTabungComponent implements OnInit {
	@Input() name;

  createTabung: CreateOrEditTabungDto = new CreateOrEditTabungDto();

  danaAwalTemp: string;
  danaAwal: number;

	constructor(
    public activeModal: NgbActiveModal,
    private tabungServiceProxy: TabungServiceProxy,
    private currencyPipe: CurrencyPipe,
    private _confirmationService: ConfirmationService
    ) {}

	ngOnInit(): void {}

  changeMonetaryFormat(element){
    this.danaAwalTemp = this.currencyPipe.transform(this.createTabung.dana_awal, '$').replace('$', '');
    element.target.value = this.danaAwalTemp;

    this.danaAwal = parseFloat(this.danaAwalTemp.replace(/,/g, ''));
  }

  save() {
    this.createTabung.dana_awal = this.danaAwal;
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
