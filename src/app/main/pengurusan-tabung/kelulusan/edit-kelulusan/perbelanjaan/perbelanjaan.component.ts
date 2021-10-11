import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbCalendar, NgbDateStruct, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import {
  CreateOrEditTabungKelulusanDto,
  GetBelanjaTabungKelulusanDto,
  TabungKelulusanServiceProxy
} from "../../../../../shared/proxy/service-proxies";
import {finalize} from "rxjs/operators";
import {ActivatedRoute, Router} from "@angular/router";
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';

@Component({
  selector: 'app-perbelanjaan',
  templateUrl: './perbelanjaan.component.html'
})
export class PerbelanjaanComponent implements OnInit {

  @Input() public idKelulusan: number;

  @ViewChild('dataTableKategori', { static: true }) dataTableKategori: Table;
	@ViewChild('paginatorTabung', { static: true }) paginatorTabung: Paginator;
  @ViewChild('dataTableBwi', { static: true }) dataTableBwi: Table;
	@ViewChild('paginatorBwi', { static: true }) paginatorBwi: Paginator;

  primengTableHelperTabung: PrimengTableHelper;
  primengTableHelperBwi: PrimengTableHelper;

  filter:any;
  tabId = 1;
  tabIdKategori = 1;

	displayMonths = 1;
	navigation = 'select';
	showWeekNumbers = false;
	outsideDays = 'visible';
  saving = true;
  tarikhSurat:string;
  tarikhMula:string;
  tarikhTamat:string;
  id:number;
  tabung:any;
  bencana:any;
  bantuan:any;
  namaBencana: string;
  arrayYear:any[];
  filterTahun: number;
  filterYear: number;
  filterPastYear: number;

  date = new Date();
  modelSurat: NgbDateStruct;
  modelMula: NgbDateStruct;
  modelTamat: NgbDateStruct;
  today = this.calendar.getToday();
  readonly DELIMITER = '-';

  kelulusan: CreateOrEditTabungKelulusanDto = new CreateOrEditTabungKelulusanDto();
  belanja: GetBelanjaTabungKelulusanDto = new GetBelanjaTabungKelulusanDto();

  bayaranTerus: any;

	constructor(
	  config: NgbModalConfig,
    private _activatedRoute: ActivatedRoute,
    private _tabungKelulusanServiceProxy: TabungKelulusanServiceProxy,
    private calendar: NgbCalendar
  ) {
    this.id = this._activatedRoute.snapshot.queryParams['id'];
		config.backdrop = 'static';
		config.keyboard = false;
    this.primengTableHelperTabung = new PrimengTableHelper();
    this.primengTableHelperBwi = new PrimengTableHelper();
	}

	ngOnInit(): void {
    this.show();
    this.getBelanja();
    this.generateArrayOfYears();
  }

  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      let date = value.split(this.DELIMITER);
      return {
        year : parseInt(date[0], 10),
        month : parseInt(date[1], 10),
        day : parseInt(date[2], 10)
      };
    }
    return null;
  }

  toModel(date: NgbDateStruct | null): string | null {
    return date ? date.year + this.DELIMITER + date.month + this.DELIMITER + date.day : null;
  }

  show() {
    if (!this.id) {
      this.kelulusan = new CreateOrEditTabungKelulusanDto();
    } else {
      this._tabungKelulusanServiceProxy.getTabungKelulusanForEdit(this.id).subscribe((result) => {
        this.kelulusan = result.tabung_kelulusan;
        if(result.tabung_kelulusan.tarikh_surat){
          this.modelSurat = this.fromModel(result.tabung_kelulusan.tarikh_surat.format('YYYY-MM-DD'));
        }
        if(result.tabung_kelulusan.tarikh_mula_kelulusan){
          this.modelMula = this.fromModel(result.tabung_kelulusan.tarikh_mula_kelulusan.format('YYYY-MM-DD'));
        }
        if(result.tabung_kelulusan.tarikh_tamat_kelulusan){
          this.modelTamat = this.fromModel(result.tabung_kelulusan.tarikh_tamat_kelulusan.format('YYYY-MM-DD'));
        }
      });
    }
  }

  getBelanja() {
    this._tabungKelulusanServiceProxy.getBelanjaByKelulusan(this.id, this.filterYear ?? undefined, this.filterPastYear ?? undefined)
      .subscribe((result) => {
        this.belanja = result;
      })
  }

  getTahun() {
    this.filterYear = this.filterTahun;
    this.filterPastYear = this.filterTahun - 1;
    this.getBelanja();
  }

  getBelanjaTabung(event?: LazyLoadEvent) {

    if (this.primengTableHelperTabung.shouldResetPaging(event)) {
			this.paginatorTabung.changePage(0);
			return;
		}

		this.primengTableHelperTabung.showLoadingIndicator();
		this._tabungKelulusanServiceProxy.getKategoriTabungByKelulusan(this.id)
      .pipe(finalize(()=> {
        this.primengTableHelperTabung.hideLoadingIndicator();
      }))
			.subscribe((result) => {
				this.primengTableHelperTabung.totalRecordsCount = result.total_count;
				this.primengTableHelperTabung.records = result.items;
			});
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

}
