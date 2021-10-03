import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { CreateOrEditTabungDto, TabungServiceProxy } from 'src/app/shared/proxy/service-proxies';
import { swalSuccess } from '@shared/sweet-alert/swal-constant';
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
    private currencyPipe: CurrencyPipe
    ) {}

	ngOnInit(): void {}

  changeMonetaryFormat(element){
    this.danaAwalTemp = this.currencyPipe.transform(this.createTabung.dana_awal, '$').replace('$', '');
    element.target.value = this.danaAwalTemp;

    this.danaAwal = parseFloat(this.danaAwalTemp.replace(/,/g, ''));
  }

  save() {
    this.createTabung.dana_awal = this.danaAwal;
    this.tabungServiceProxy.createOrEdit(this.createTabung).subscribe(()=>{
      swalSuccess.fire('Berjaya', 'Maklumat Tabung Berjaya Ditambah').then(() => {
				this.activeModal.close(true);
      });
    })
  }
}
