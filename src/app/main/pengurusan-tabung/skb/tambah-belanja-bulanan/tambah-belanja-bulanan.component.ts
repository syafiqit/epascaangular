import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import {
  CreateOrEditTabungBayaranSkbBulananDto,
  TabungBayaranSkbBulananServiceProxy,
  OutputCreateSkbBulananDto
} from 'src/app/shared/proxy/service-proxies';
import { ConfirmationService } from '@app/shared/services/confirmation';
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
	@Input() id_bulan;
	@Input() jumlah;
  @Input() kategori;
  @Input() id_tabung_bayaran_skb;
  @Input() id_tabung;
  @Input() jumlah_baki_peruntukan;

	bulanan: CreateOrEditTabungBayaranSkbBulananDto = new CreateOrEditTabungBayaranSkbBulananDto();
  output: OutputCreateSkbBulananDto = new OutputCreateSkbBulananDto();

	saving = false;
  arrayYear:any[];
  jumlah_lama: number;
  baki_baru: any;
  bulan_id: number;

  months = [
    { id: 1, bulan: "JANUARI" }, { id: 2, bulan: "FEBRUARI" }, { id: 3, bulan: "MAC" }, { id: 4, bulan: "APRIL" },
    { id: 5, bulan: "MEI" }, { id: 6, bulan: "JUN" }, { id: 7, bulan: "JULAI" }, { id: 8, bulan: "OGOS" },
    { id: 9, bulan: "SEPTEMBER" }, { id: 10, bulan: "OKTOBER" }, { id: 11, bulan: "NOVEMBER" }, { id: 12, bulan: "DISEMBER" }
  ]

	constructor(
		public activeModal: NgbActiveModal,
    private _confirmationService: ConfirmationService,
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
      this.bulan_id = this.id_bulan;
      this.bulanan.jumlah = this.jumlah;
		}
    else {
			this._tabungBayaranSkbBulananServiceProxy.getTabungBayaranSkbBulananForEdit(this.id).subscribe((result) => {
				this.bulanan = result.tabung_bayaran_skb_bulanan;
        this.bulan_id = result.tabung_bayaran_skb_bulanan.id_bulan;
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

  getIdBulan() {
    this.bulan_id = this.months.findIndex(e=> e.bulan == this.bulanan.bulan) + 1;
  }

	save(id, tahun, bulan, id_bulan, jumlah): void {
    if (this.kategori == 1 && !this.idBulan) {
      if(jumlah <= this.jumlah_baki_peruntukan) {
        this.activeModal.close({tahun: tahun, bulan: bulan, id_bulan: id_bulan, jumlah: jumlah });
      } else{
        const dialogRef = this._confirmationService.open({
          title: 'Tidak Berjaya',
          message: 'Jumlah Belanja Bulanan Melebihi Jumlah Baki Siling SKB',
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
    }
    else if (this.kategori == 1 && this.idBulan){
      this.baki_baru = this.jumlah + this.jumlah_baki_peruntukan;
      if(jumlah <= this.baki_baru) {
        this.activeModal.close({ id: this.idBulan, tahun: tahun, bulan: bulan, id_bulan: id_bulan, jumlah: jumlah });
      } else{
        const dialogRef = this._confirmationService.open({
          title: 'Tidak Berjaya',
          message: 'Jumlah Belanja Bulanan Melebihi Jumlah Baki Siling SKB',
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
    }
    else {
      this.saving = true;
      this.bulanan.id_tabung_bayaran_skb = this.id_tabung_bayaran_skb;
      this.bulanan.id_tabung = this.id_tabung;
      this.bulanan.id_bulan = this.bulan_id;
      this.bulanan.jumlah_lama = this.jumlah_lama;
      this._tabungBayaranSkbBulananServiceProxy
      .createOrEdit(this.bulanan)
      .pipe()
      .subscribe((result) => {
        this.output = result;
        if(this.output.message == "Maklumat SKB Bulanan Berjaya Ditambah!"){
          const dialogRef = this._confirmationService.open({
            title: 'Berjaya',
            message: 'Maklumat Belanja Bulanan SKB Berjaya Dihantar',
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
        else if(this.output.message == "Maklumat SKB Bulanan Berjaya Dikemaskini!"){
          const dialogRef = this._confirmationService.open({
            title: 'Berjaya',
            message: 'Maklumat Belanja Bulanan SKB Berjaya Disimpan',
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
        }else{
          const dialogRef = this._confirmationService.open({
            title: 'Tidak Berjaya',
            message: this.output.message,
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
      });
    }
  }
}
