import { Component, Input, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { NgbCalendar, NgbDateStruct, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import {
  CreateOrEditTabungKelulusanDto, RefBantuanServiceProxy, RefBencanaServiceProxy,
  TabungKelulusanServiceProxy, TabungServiceProxy
} from "../../../../../shared/proxy/service-proxies";
import * as moment from "moment";
import {ActivatedRoute, Router} from "@angular/router";
import { TambahRujukanBencanaComponent } from '../../tambah-kelulusan/tambah-rujukan-bencana/tambah-rujukan-bencana.component';
import { PilihBencanaKelulusanComponent } from '../../pilih-bencana-kelulusan/pilih-bencana-kelulusan.component';
import { ConfirmationService } from '@services/confirmation';

@Component({
  selector: 'app-maklumat-surat',
  templateUrl: './maklumat-surat.component.html'
})
export class MaklumatSuratComponent implements OnInit {

  @Input() public idKelulusan: number;
  @Input() public idTabung: number;
  @Input() public tabungKemaskiniKelulusan: number;

  filter:any;
  test:any;

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

  date = new Date();
  modelSurat: NgbDateStruct;
  modelMula: NgbDateStruct;
  modelTamat: NgbDateStruct;
  today = this.calendar.getToday();
  readonly DELIMITER = '-';

  kelulusan: CreateOrEditTabungKelulusanDto = new CreateOrEditTabungKelulusanDto();

  bayaranTerus: any;

	constructor(
	  config: NgbModalConfig,
    private modalService: NgbModal,
    private _location: Location,
    private router: Router,
    private _activatedRoute: ActivatedRoute,
    private _tabungKelulusanServiceProxy: TabungKelulusanServiceProxy,
    private _tabungServiceProxy: TabungServiceProxy,
    private _refBencanaServiceProxy: RefBencanaServiceProxy,
    private _refBantuanServiceProxy: RefBantuanServiceProxy,
    private calendar: NgbCalendar,
		private _confirmationService: ConfirmationService
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

        this.populateTabung();
      });
    }
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

  save(): void {
    this.saving = true;
    if(this.modelSurat){
      this.tarikhSurat = this.toModel(this.modelSurat);
      this.kelulusan.tarikh_surat = moment(this.tarikhSurat, "YYYY-MM-DD");
    }
    if(this.modelMula){
      this.tarikhMula = this.toModel(this.modelMula);
      this.kelulusan.tarikh_mula_kelulusan = moment(this.tarikhMula, "YYYY-MM-DD");
    }
    if(this.modelTamat){
      this.tarikhTamat = this.toModel(this.modelTamat);
      this.kelulusan.tarikh_tamat_kelulusan = moment(this.tarikhTamat, "YYYY-MM-DD");
    }

    this._tabungKelulusanServiceProxy
      .createOrEdit(this.kelulusan)
      .pipe()
      .subscribe((response) => {
        if(response.message == "Maklumat Kelulusan Berjaya Dikemaskini"){
          this.successMessage();
        }
        else{
          this.errorMessage(response);
        }

      });
  }

  successMessage(){
    const dialogRef = this._confirmationService.open({
      title: 'Berjaya',
      message: 'Maklumat Tabung Kelulusan Berjaya Dikemaskini',
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
      if(this.tabungKemaskiniKelulusan){
        this.router.navigate(['/app/tabung/edit'], { queryParams: { id: this.idTabung } });
      }else{
        this.router.navigate(['/app/tabung/kelulusan/senarai']);
      }
    });
  }

  errorMessage(response?){
    const dialogRef = this._confirmationService.open({
      title: 'Tidak Berjaya',
      message: response.message,
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
    dialogRef.afterClosed().subscribe(() => {
    });
  }

  addBencana() {
		const modalRef = this.modalService.open(PilihBencanaKelulusanComponent, { size: 'xl' });
		modalRef.componentInstance.name = 'add';
    modalRef.result.then(
			(response) => {
				if (response) {
          this.kelulusan.id_tabung = response.id;
					this.namaBencana = response.nama_tabung;
				}
			}
		);
	}

  populateTabung(id?){
    this._tabungServiceProxy.getTabungForEdit(this.kelulusan.id_tabung).subscribe((result) => {
      this.namaBencana = result.tabung.nama_tabung;
    });
  }

  back(){
    this._location.back();
  }
}
