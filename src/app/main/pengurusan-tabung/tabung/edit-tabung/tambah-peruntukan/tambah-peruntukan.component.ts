import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { CreateOrEditTabungPeruntukanDto, RefSumberPeruntukanServiceProxy, TabungPeruntukanServiceProxy } from 'src/app/shared/proxy/service-proxies';
import * as moment from 'moment';
import { swalSuccess } from '@shared/sweet-alert/swal-constant';

@Component({
	selector: 'app-tambah-peruntukan',
	templateUrl: './tambah-peruntukan.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TambahPeruntukanComponent implements OnInit {
	@Input() name;
  @Input() id;
  @Input() idTabungPeruntukan;

  peruntukan: CreateOrEditTabungPeruntukanDto = new CreateOrEditTabungPeruntukanDto();

	modelFooter: NgbDateStruct;
	today = this.calendar.getToday();
  tarikhPeruntukan: string;
  sumberPeruntukan: any;

	constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private calendar: NgbCalendar,
    private tabungPeruntukanServiceProxy: TabungPeruntukanServiceProxy,
    private _refSumberPeruntukanServiceProxy: RefSumberPeruntukanServiceProxy
    ) {}

	ngOnInit(): void {
    this.getSumberPeruntukan();
    this.show();
  }

  show() {
		if (this.id && !this.idTabungPeruntukan) {
			this.peruntukan = new CreateOrEditTabungPeruntukanDto();
		} else if(this.id){
			this.tabungPeruntukanServiceProxy.getTabungPeruntukanForEdit(this.idTabungPeruntukan).subscribe((result) => {
				this.peruntukan = result.tabung_peruntukan;
        this.tarikhPeruntukan = result.tabung_peruntukan.tarikh_peruntukan.format('yyyy-MM-DD');
			});
		}
	}

  getSumberPeruntukan(filter?) {
    this._refSumberPeruntukanServiceProxy.getRefSumberPeruntukanForDropdown(filter).subscribe((result) => {
      this.sumberPeruntukan = result.items;
    });
  }

  save() {
    this.peruntukan.id_tabung = this.id;
    this.peruntukan.tarikh_peruntukan = moment(this.tarikhPeruntukan);
    this.tabungPeruntukanServiceProxy.createOrEdit(this.peruntukan).subscribe(()=>{
      swalSuccess.fire('Berjaya', 'Tabung Peruntukan Berjaya Dikemaskini').then(() => {
				this.activeModal.close(true);
      });
    })
  }
}
