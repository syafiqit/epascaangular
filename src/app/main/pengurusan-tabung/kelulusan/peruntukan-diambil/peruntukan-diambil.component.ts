import { Component, Input, OnInit } from '@angular/core';
import { CreateOrEditTabungKelulusanAmbilanDto, TabungKelulusanAmbilanServiceProxy } from '@app/shared/proxy/service-proxies';
import { NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { swalSuccess } from '@shared/sweet-alert/swal-constant';

@Component({
  selector: 'app-peruntukan-diambil',
  templateUrl: './peruntukan-diambil.component.html'
})
export class PeruntukanDiambilComponent implements OnInit {
  @Input() id_tabung;
  @Input() id_tabung_kelulusan;

  saving:any;
  peruntukan: CreateOrEditTabungKelulusanAmbilanDto = new CreateOrEditTabungKelulusanAmbilanDto();

  constructor(
    config: NgbModalConfig,
    public activeModal: NgbActiveModal,
    private _tabungKelulusanAmbilanServiceProxy: TabungKelulusanAmbilanServiceProxy
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

  save(): void {
    this.saving = true;
    this.peruntukan.id_tabung = this.id_tabung;
    this.peruntukan.id_tabung_kelulusan = this.id_tabung_kelulusan;
    
    this._tabungKelulusanAmbilanServiceProxy
      .createOrEdit(this.peruntukan)
      .pipe()
      .subscribe(() => {
        swalSuccess.fire('Berjaya!', 'Maklumat Tabung Kelulusan Berjaya Disimpan.', 'success');
      });
      this.activeModal.close(true);
  }

}
