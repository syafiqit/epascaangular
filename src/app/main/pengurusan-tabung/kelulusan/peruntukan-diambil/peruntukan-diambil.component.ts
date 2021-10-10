import { Component, Input, OnInit } from '@angular/core';
import { CreateOrEditTabungKelulusanAmbilanDto, TabungKelulusanAmbilanServiceProxy } from '@app/shared/proxy/service-proxies';
import { NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService } from '@services/confirmation';

@Component({
  selector: 'app-peruntukan-diambil',
  templateUrl: './peruntukan-diambil.component.html'
})
export class PeruntukanDiambilComponent implements OnInit {
  @Input() id_tabung;
  @Input() id_tabung_kelulusan;
  @Input() baki_jumlah_siling;

  saving:any;
  peruntukan: CreateOrEditTabungKelulusanAmbilanDto = new CreateOrEditTabungKelulusanAmbilanDto();
  jumlahBaru = 0;

  constructor(
    config: NgbModalConfig,
    public activeModal: NgbActiveModal,
    private _tabungKelulusanAmbilanServiceProxy: TabungKelulusanAmbilanServiceProxy,
		private _confirmationService: ConfirmationService
    ) {
      config.backdrop = 'static';
		  config.keyboard = false;
    }

  ngOnInit(): void {
    // this.show()
  }

  show() {
    if (!this.id_tabung) {
      this.peruntukan = new CreateOrEditTabungKelulusanAmbilanDto();
    } else {
      this._tabungKelulusanAmbilanServiceProxy.getTabungKelulusanAmbilanForEdit(this.id_tabung).subscribe((result) => {
        this.peruntukan = result.tabung_kelulusan_ambilan;

      });
    }
  }

  kiraJumlah(){
    this.jumlahBaru =  this.baki_jumlah_siling - this.peruntukan.jumlah
  }

  save(): void {
    this.saving = true;
    this.peruntukan.id_tabung = this.id_tabung;
    this.peruntukan.id_tabung_kelulusan = this.id_tabung_kelulusan;

    this._tabungKelulusanAmbilanServiceProxy
      .createOrEdit(this.peruntukan)
      .pipe()
      .subscribe(() => {
        const dialogRef = this._confirmationService.open({
          title: 'Berjaya',
          message: 'Maklumat Peruntukan Diambil Berjaya Disimpan.',
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
      });
  }

}
