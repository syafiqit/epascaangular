import { Component, Input, OnInit } from '@angular/core';
import { CreateOrEditTabungKelulusanAmbilanDto, OutputCreateTabungKelulusanDto, TabungKelulusanAmbilanServiceProxy } from '@app/shared/proxy/service-proxies';
import { NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService } from '@services/confirmation';

@Component({
  selector: 'app-peruntukan-diambil',
  templateUrl: './peruntukan-diambil.component.html'
})
export class PeruntukanDiambilComponent implements OnInit {
  @Input() name;
  @Input() id;
  @Input() id_tabung;
  @Input() id_tabung_kelulusan;
  @Input() baki_jumlah_siling;

  saving:any;
  peruntukan: CreateOrEditTabungKelulusanAmbilanDto = new CreateOrEditTabungKelulusanAmbilanDto();
  jumlahBaru = 0;
  jumlah = 0;
  kosong = 0;

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
    this.show();
  }

  show() {
    if (!this.id) {
      this.peruntukan = new CreateOrEditTabungKelulusanAmbilanDto();
    } else {
      this._tabungKelulusanAmbilanServiceProxy.getTabungKelulusanAmbilanForEdit(this.id).subscribe((result) => {
        this.peruntukan = result.tabung_kelulusan_ambilan;
        this.jumlah = this.peruntukan.jumlah;

      });
    }
  }

  kiraJumlah(){
    if(!this.id){
      this.jumlahBaru =  this.baki_jumlah_siling - this.peruntukan.jumlah;
    }
    else{
      if(this.peruntukan.jumlah < this.jumlah){
        this.jumlahBaru = Number(this.baki_jumlah_siling) + (this.jumlah - this.peruntukan.jumlah);
      }
      else if(this.peruntukan.jumlah > this.jumlah){
        this.jumlahBaru =  Number(this.baki_jumlah_siling) - (this.peruntukan.jumlah - this.jumlah);
      }
      else if(this.peruntukan.jumlah = this.jumlah){
        this.jumlahBaru =  this.baki_jumlah_siling;
      }
    }
  }

  save(): void {
    this.saving = true;
    this.peruntukan.id_tabung = this.id_tabung;
    this.peruntukan.id_tabung_kelulusan = this.id_tabung_kelulusan;

    this._tabungKelulusanAmbilanServiceProxy
      .createOrEdit(this.peruntukan)
      .pipe()
      .subscribe((result) => {
        if(result.message == "Peruntukan Diambil Berjaya"){
          this.successMessage(result);
        }else if(result.message == "Peruntukan Diambil Berjaya Dikemaskini"){
          this.successUpdateMessage(result);
        }else{
          this.errorMessage(result);
        }
      });
  }

  successMessage(result?){
    const dialogRef = this._confirmationService.open({
      title: 'Berjaya',
      message: 'Peruntukan Diambil Berjaya Disimpan',
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

  successUpdateMessage(result?){
    const dialogRef = this._confirmationService.open({
      title: 'Berjaya',
      message: result.message,
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

  errorMessage(result?){
    const dialogRef = this._confirmationService.open({
      title: 'Harap Maaf!',
      message: result.message,
      icon: {
        show: true,
        name: 'alert-triangle',
        color: 'warning'
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

}
