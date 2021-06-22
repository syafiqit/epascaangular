import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { CreateOrEditTabungBayaranSkbBulananDto, TabungBayaranSkbBulananServiceProxy } from 'src/app/shared/proxy/service-proxies';
declare let require;
const Swal = require('sweetalert2');
@Component({
	selector: 'app-tambah-belanja-bulanan',
	templateUrl: './tambah-belanja-bulanan.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class TambahBelanjaBulanan implements OnInit {
	@Input() name;
	@Input() id;
  @Input() idBulan;
	@Input() tahun;
	@Input() bulan;
	@Input() jumlah;
  @Input() kategori;
  @Input() id_tabung_bayaran_skb;

	bulanan: CreateOrEditTabungBayaranSkbBulananDto = new CreateOrEditTabungBayaranSkbBulananDto();
	saving = false;

	constructor(
		public activeModal: NgbActiveModal,
    private _tabungBayaranSkbBulananServiceProxy: TabungBayaranSkbBulananServiceProxy
	) {}

	ngOnInit(): void {
    this.show();
  }

	show() {
		if (!this.id) {
			this.bulanan = new CreateOrEditTabungBayaranSkbBulananDto();
      this.bulanan.tahun = this.tahun;
      this.bulanan.bulan = this.bulan;
      this.bulanan.jumlah = this.jumlah;
		}
    else {
			this._tabungBayaranSkbBulananServiceProxy.getTabungBayaranSkbBulananForEdit(this.id).subscribe((result) => {
				this.bulanan = result.tabung_bayaran_skb_bulanan;
			});
		}
	}

	save(id, tahun, bulan, jumlah): void {
    if (this.kategori == 1 && !this.idBulan) {
      this.activeModal.close({tahun: tahun, bulan: bulan, jumlah: jumlah });
    }
    else if (this.kategori ==1 && this.idBulan){
      this.activeModal.close({ id: this.idBulan, tahun: tahun, bulan: bulan, jumlah: jumlah });
    }
    else {
      this.saving = true;

      this.bulanan.id_tabung_bayaran_skb = this.id_tabung_bayaran_skb;
      this._tabungBayaranSkbBulananServiceProxy
        .createOrEdit(this.bulanan)
        .pipe()
        .subscribe(() => {
          if (this.name == 'add') {
            Swal.fire('Berjaya!', 'Maklumat Belanja Bulanan SKB Berjaya Ditambah.', 'success');
          } else if (this.name == 'edit') {
            Swal.fire('Berjaya!', 'Maklumat Belanja Bulanan SKB Berjaya Dikemaskini.', 'success');
          }
          this.activeModal.close(true);
        });
    }
  }
}