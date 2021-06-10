import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { CreateOrEditTabungDto, TabungServiceProxy } from 'src/app/shared/proxy/service-proxies';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
declare let require;
const Swal = require('sweetalert2');

@Component({
	selector: 'app-tambah-edit-tabung',
	templateUrl: './tambah-edit-tabung.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TambahEditTabungComponent implements OnInit {
	@Input() name;

  createTabung: CreateOrEditTabungDto = new CreateOrEditTabungDto();


	modelFooter: NgbDateStruct;
	today = this.calendar.getToday();
  tarikhBaki: string;
  idTabung: any;

	constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private calendar: NgbCalendar,
    private _activatedRoute: ActivatedRoute,
    private tabungServiceProxy: TabungServiceProxy
    ) {
      this._activatedRoute.queryParams.subscribe((p) => {
        this.idTabung = p['id'];
      });
    }

	ngOnInit(): void {}

  save() {
    this.createTabung.tarikh_baki = moment(this.tarikhBaki);
    this.tabungServiceProxy.createOrEdit(this.createTabung).subscribe(()=>{
      Swal.fire('Berjaya', 'Maklumat Tabung Berjaya Ditambah').then(() => {
				this.activeModal.close(true);
      });
    })
  }
}
