import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { TambahRujukanBencanaComponent } from './tambah-rujukan-bencana/tambah-rujukan-bencana.component';
import {
  CreateOrEditTabungKelulusanDto, RefBantuanServiceProxy, RefBencanaServiceProxy,
  TabungKelulusanServiceProxy, TabungServiceProxy
} from "../../../../shared/proxy/service-proxies";
import {finalize} from "rxjs/operators";
import * as moment from "moment";
import {ActivatedRoute} from "@angular/router";
declare let require;
const Swal = require('sweetalert2');

@Component({
	selector: 'app-tambah-kelulusan',
	templateUrl: './tambah-kelulusan.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TambahKelulusanComponent implements OnInit {
	displayMonths = 1;
	navigation = 'select';
	showWeekNumbers = false;
	outsideDays = 'visible';
  saving = true;
  date = new Date().toISOString();
  tarikhSurat:string;
  tarikhMula:string;
  tarikhTamat:string;
  id:number;
  tabung:any;
  bencana:any;
  bantuan:any;

  kelulusan: CreateOrEditTabungKelulusanDto = new CreateOrEditTabungKelulusanDto();

	constructor(
	  config: NgbModalConfig,
    private modalService: NgbModal,
    private _activatedRoute: ActivatedRoute,
    private _tabungKelulusanServiceProxy: TabungKelulusanServiceProxy,
    private _tabungServiceProxy: TabungServiceProxy,
    private _refBencanaServiceProxy: RefBencanaServiceProxy,
    private _refBantuanServiceProxy: RefBantuanServiceProxy
  ) {
    this.id = this._activatedRoute.snapshot.queryParams['id'];
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
    this.show();
    this.getTabung();
    this.getBencana();
    this.getBantuan();
  }

	approvalAddModal() {
		this.modalService.open(TambahRujukanBencanaComponent, { size: 'lg' });
	}

  getTabung(filter?) {
    this._tabungServiceProxy.getTabungForDropdown(filter).subscribe((result) => {
      this.tabung = result.items;
    });
  }

  getBencana(filter?) {
    this._refBencanaServiceProxy.getRefBencanaForDropdown(filter).subscribe((result) => {
      this.bencana = result.items;
    });
  }

  getBantuan(filter?) {
    this._refBantuanServiceProxy.getRefBantuanForDropdown(filter).subscribe((result) => {
      this.bantuan = result.items;
    });
  }

  show() {
    if (!this.id) {
      this.kelulusan = new CreateOrEditTabungKelulusanDto();
    } else {
      this._tabungKelulusanServiceProxy.getTabungKelulusanForEdit(this.id).subscribe((result) => {
        this.kelulusan = result.tabung_kelulusan;
      });
    }
  }

  save(): void {
    this.saving = true;
    // this.daerah.id = 1;
    this.kelulusan.tarikh_surat = moment(this.tarikhSurat);
    this.kelulusan.tarikh_mula_kelulusan = moment(this.tarikhMula);
    this.kelulusan.tarikh_tamat_kelulusan = moment(this.tarikhTamat);

    this._tabungKelulusanServiceProxy
      .createOrEdit(this.kelulusan)
      .pipe()
      .subscribe(() => {
        Swal.fire('Berjaya!', 'Maklumat Daerah Berjaya Ditambah.', 'success');
      });
  }
}
