import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { CreateOrEditTabungDto, GetTabungForViewDto, TabungServiceProxy } from 'src/app/shared/proxy/service-proxies';
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

	tarikhBakiSemasa: string;
  idTabung: any;
  filter: string;
  tabungSebelum: any;
  dropdownTabungSebelum: any;
  previousDate: number;
  filterPreviousDate: string;
  tabungSebelumCheck = false;
  id_tabung_sebelum: any;

  date = new Date();
  model: NgbDateStruct;
  today = this.calendar.getToday();
  readonly DELIMITER = '-';

	constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private calendar: NgbCalendar,
    private _activatedRoute: ActivatedRoute,
    private tabungServiceProxy: TabungServiceProxy,
    ) {
      this._activatedRoute.queryParams.subscribe((p) => {
        this.idTabung = p['id'];
      });
      this.tabungSebelum = new GetTabungForViewDto();
    }

	ngOnInit(): void {
    this.getTabungSebelum();
  }

  getTabungSebelum() {
    this.previousDate = new Date().getFullYear() - 1;
    this.filterPreviousDate = this.previousDate.toString();

		this.tabungServiceProxy.getTabungByYearForDropdown(this.filter, this.filterPreviousDate).subscribe((result) => {
			this.dropdownTabungSebelum = result.items;
		});
	}

  pilihTabungSebelum(idTabungSebelum){
    if(idTabungSebelum){
      this.tabungSebelumCheck = true;
      this.tabungServiceProxy.getTabungForEdit(idTabungSebelum).subscribe((result)=>{
        this.tabungSebelum = result.tabung;
      })

    }else{
      this.tabungSebelumCheck = false;
    }
  }

  toModel(date: NgbDateStruct | null): string | null {
    return date ? date.year + this.DELIMITER + date.month + this.DELIMITER + date.day : null;
  }

  save() {
    this.createTabung.id_tabung_sebelum = this.id_tabung_sebelum;
    this.createTabung.baki_bawaan = this.tabungSebelum.jumlah_baki_semasa;

    if(this.model){
      this.tarikhBakiSemasa = this.toModel(this.model);
      this.createTabung.tarikh_baki = moment(this.tarikhBakiSemasa, "YYYY-MM-DD");
    }

    this.tabungServiceProxy.createOrEdit(this.createTabung).subscribe(()=>{
      Swal.fire('Berjaya', 'Maklumat Tabung Berjaya Ditambah').then(() => {
				this.activeModal.close(true);
      });
    })
  }
}
