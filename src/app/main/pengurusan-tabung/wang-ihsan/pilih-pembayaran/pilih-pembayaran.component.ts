import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { BwiBayaranSecaraTerusComponent } from './bwi-bayaran-secara-terus/bwi-bayaran-secara-terus.component';
import { BwiSuratKuasaBelanjaComponent } from './bwi-surat-kuasa-belanja/bwi-surat-kuasa-belanja.component';

@Component({
  selector: 'app-pilih-pembayaran',
  templateUrl: './pilih-pembayaran.component.html',
  encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class PilihPembayaranComponent implements OnInit {

	constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal
  ) {}

	ngOnInit(): void {}

  pilihSuratKuasaBelanja(){
    const modalRef = this.modalService.open(BwiSuratKuasaBelanjaComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
    modalRef.componentInstance.kategori = 1;

    modalRef.result.then(
			(response) => {
				if (response) {
          this.activeModal.close({
            id: response.id,
            no_rujukan_bayaran: response.no_rujukan_bayaran,
            perihal: response.perihal,
            no_rujukan_kelulusan: response.no_rujukan_kelulusan,
            jumlah: response.jumlah,
            idJenisBayaran: response.idJenisBayaran
          });
				}
			},
			() => {}
		);
  }


  pilihBayaranTerus(){
    const modalRef = this.modalService.open(BwiBayaranSecaraTerusComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
    modalRef.componentInstance.kategori = 1;

    modalRef.result.then(
			(response) => {
				if (response) {
          this.activeModal.close({
            id: response.id,
            no_rujukan_bayaran: response.no_rujukan_bayaran,
            perihal: response.perihal,
            no_rujukan_kelulusan: response.no_rujukan_kelulusan,
            jumlah: response.jumlah,
            idJenisBayaran: response.idJenisBayaran
          });
				}
			},
			() => {}
		);
  }

}
