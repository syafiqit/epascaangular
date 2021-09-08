import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { CreateOrEditTabungBayaranSkbBulananDto, TabungBayaranSkbBulananServiceProxy } from 'src/app/shared/proxy/service-proxies';
import { swalSuccess } from '@shared/sweet-alert/swal-constant';
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
  @Input() id_tabung;

	bulanan: CreateOrEditTabungBayaranSkbBulananDto = new CreateOrEditTabungBayaranSkbBulananDto();
	saving = false;
  arrayYear:any[];
  jumlah_lama: number;

  months = [
    { id: 1, bulan: "JANUARI" }, { id: 2, bulan: "FEBRUARI" }, { id: 3, bulan: "MAC" }, { id: 4, bulan: "APRIL" },
    { id: 5, bulan: "MEI" }, { id: 6, bulan: "JUN" }, { id: 7, bulan: "JULAI" }, { id: 8, bulan: "OGOS" },
    { id: 9, bulan: "SEPTEMBER" }, { id: 10, bulan: "OKTOBER" }, { id: 11, bulan: "NOVEMBER" }, { id: 12, bulan: "DISEMBER" }
  ]

	constructor(
		public activeModal: NgbActiveModal,
    private _tabungBayaranSkbBulananServiceProxy: TabungBayaranSkbBulananServiceProxy
	) {}

	ngOnInit(): void {
	  this.generateArrayOfYears()
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
        this.jumlah_lama = result.tabung_bayaran_skb_bulanan.jumlah;
			});
		}
	}

  generateArrayOfYears() {
    let max = new Date().getFullYear();
    let min = max - 9;
    let years = [];

    for (let i = max; i >= min; i--) {
      years.push(i)
    }
    this.arrayYear = years;
  }

	save(id, tahun, bulan, jumlah): void {
    if (this.kategori == 1 && !this.idBulan) {
      this.activeModal.close({tahun: tahun, bulan: bulan, jumlah: jumlah });
    }
    else if (this.kategori == 1 && this.idBulan){
      this.activeModal.close({ id: this.idBulan, tahun: tahun, bulan: bulan, jumlah: jumlah });
    }
    else {
      this.saving = true;

      this.bulanan.id_tabung_bayaran_skb = this.id_tabung_bayaran_skb;
      this.bulanan.id_tabung = this.id_tabung;
      this.bulanan.jumlah_lama = this.jumlah_lama;
      this._tabungBayaranSkbBulananServiceProxy
        .createOrEdit(this.bulanan)
        .pipe()
        .subscribe(() => {
          if (this.name == 'add') {
            swalSuccess.fire('Berjaya!', 'Maklumat Belanja Bulanan SKB Berjaya Ditambah.', 'success');
          } else if (this.name == 'edit') {
            swalSuccess.fire('Berjaya!', 'Maklumat Belanja Bulanan SKB Berjaya Dikemaskini.', 'success');
          }
          this.activeModal.close(true);
        });
    }
  }
}
