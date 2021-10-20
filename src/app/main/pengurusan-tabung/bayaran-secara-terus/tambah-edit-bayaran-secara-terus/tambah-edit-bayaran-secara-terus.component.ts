import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbCalendar, NgbDateStruct, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import {
  CreateOrEditTabungBayaranTerusDto,
  OutputCreateBayaranTerusDto,
  RefAgensiServiceProxy,
  RefBencanaServiceProxy,
  RefJenisBayaranServiceProxy,
  RefJenisBencanaServiceProxy,
  RefKategoriBayaranServiceProxy,
  RefKementerianServiceProxy,
  RefNegeriServiceProxy,
  TabungBayaranTerusServiceProxy
} from 'src/app/shared/proxy/service-proxies';
import { PilihBencanaComponent } from '../pilih-bencana/pilih-bencana.component';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from '@services/confirmation';
import { fadeVerticalAnimation } from '@app/shared/data/router-animation/fade-vertical-animation';
import { PilihanRujukanKelulusanComponent } from '../../skb/pilihan-rujukan-kelulusan/pilihan-rujukan-kelulusan.component';
@Component({
	selector: 'app-tambah-edit-bayaran-secara-terus',
	templateUrl: './tambah-edit-bayaran-secara-terus.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal],
  animations: [fadeVerticalAnimation]
})
export class TambahEditBayaranSecaraTerusComponent implements OnInit {

  bayaranTerus: CreateOrEditTabungBayaranTerusDto = new CreateOrEditTabungBayaranTerusDto();
  output: OutputCreateBayaranTerusDto = new OutputCreateBayaranTerusDto();

	displayMonths = 1;
	navigation = 'select';
	showWeekNumbers = false;
	outsideDays = 'visible';
  filterTabung: string;
  filterBencana: string;
  filterJenisBencana: string;
  bencana: any;
  negeri: any;
  agensi: any;
  id_kategori_penerima: number;
  kementerian: any;
  jenisBencana: any;
  jenisBayaran: any;
  kategoriBayaran: any;
  id_jenis_bayaran: number;
  id_tabung_kelulusan: number;
  no_rujukan_kelulusan: string;
  namaTabung: string;
  namaBencana: string;
  tarikh_bencana: NgbDateStruct;
  modelTarikh: NgbDateStruct;
  modelTarikhBencana: NgbDateStruct;
  today = this.calendar.getToday();
  readonly DELIMITER = '-';
  tarikhBayaran: string;
  tarikhBencana: string;
  idBayaranTerus: any;
  checkingBwi: number;

  kategoriPenerima=[
    {id: 1, nama_kategori: "Negeri"},
    {id: 2, nama_kategori: "Agensi"},
    {id: 3, nama_kategori: "Kementerian"}
  ]

	constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private calendar: NgbCalendar,
    private router: Router,
    private _activatedRoute: ActivatedRoute,
    private tabungBayaranTerusServiceProxy: TabungBayaranTerusServiceProxy,
    private _refBencanaServiceProxy: RefBencanaServiceProxy,
    private _refJenisBencanaServiceProxy: RefJenisBencanaServiceProxy,
    private _refJenisBayaranServiceProxy: RefJenisBayaranServiceProxy,
    private _refKategoriBayaranServiceProxy: RefKategoriBayaranServiceProxy,
    private _refNegeriServiceProxy: RefNegeriServiceProxy,
    private _refAgensiServiceProxy: RefAgensiServiceProxy,
    private _refKementerianServiceProxy: RefKementerianServiceProxy,
    private _confirmationService: ConfirmationService,
    ) {
    this.idBayaranTerus = this._activatedRoute.snapshot.queryParams['id'];
    this.id_tabung_kelulusan = this._activatedRoute.snapshot.queryParams['kelulusan'];
    this.no_rujukan_kelulusan = this._activatedRoute.snapshot.queryParams['no_ruj'];
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
    this.show();
    this.getNegeri();
    this.getAgensi();
    this.getKementerian();
    this.getBencana();
    this.getKategoriBencana();
    this.getJenisBayaran();
    this.getKategoriBayaran();
  }

  show(){
    if (!this.idBayaranTerus) {
			this.bayaranTerus = new CreateOrEditTabungBayaranTerusDto();
		} else {
			this.tabungBayaranTerusServiceProxy.getTabungBayaranTerusForEdit(this.idBayaranTerus).subscribe((result) => {
				this.bayaranTerus = result.tabung_bayaran_terus;
        this.no_rujukan_kelulusan = result.tabung_bayaran_terus.no_rujukan_kelulusan;
        this.namaBencana = result.tabung_bayaran_terus.nama_bencana;
        this.checkingBwi = result.bwiCount;
        if(result.tabung_bayaran_terus.tarikh){
          this.modelTarikh = this.fromModel(result.tabung_bayaran_terus.tarikh.format('YYYY-MM-DD'));
        }
        if(result.tabung_bayaran_terus.tarikh_bencana){
          this.modelTarikhBencana = this.fromModel(result.tabung_bayaran_terus.tarikh_bencana.format('YYYY-MM-DD'));
        }
        if(result.tabung_bayaran_terus.id_negeri){
          this.id_kategori_penerima = 1;
        }
        if(result.tabung_bayaran_terus.id_agensi){
          this.id_kategori_penerima = 2;
        }
        if(result.tabung_bayaran_terus.id_kementerian){
          this.id_kategori_penerima = 3;
        }
			});
		}
  }

  getNegeri(filter?){
    this._refNegeriServiceProxy.getRefNegeriForDropdown(filter).subscribe((result) => {
			this.negeri = result.items;
		});
  }

  getAgensi(filter?){
    this._refAgensiServiceProxy.getRefAgensiForDropdown(filter).subscribe((result) => {
			this.agensi = result.items;
		});
  }

  getKementerian(filter?){
    this._refKementerianServiceProxy.getRefKementerianForDropdown(filter).subscribe((result) => {
			this.kementerian = result.items;
		});
  }

  getBencana(){
    this._refBencanaServiceProxy.getRefBencanaForDropdown(this.filterBencana).subscribe((result) => {
			this.bencana = result.items;
		});
  }

  getKategoriBencana(){
    this._refJenisBencanaServiceProxy.getRefJenisBencanaForDropdown(this.filterJenisBencana).subscribe((result) => {
			this.jenisBencana = result.items;
		});
  }

  getJenisBayaran(){
    this._refJenisBayaranServiceProxy.getRefJenisBayaranForDropdown(this.filterJenisBencana).subscribe((result) => {
			this.jenisBayaran = result.items;
		});
  }

  getKategoriBayaran(){
    this._refKategoriBayaranServiceProxy.getRefKategoriBayaranForDropdown(this.filterJenisBencana).subscribe((result) => {
			this.kategoriBayaran = result.items;
		});
  }

	addRujukanKelulusan() {
		const modalRef = this.modalService.open(PilihanRujukanKelulusanComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
    modalRef.result.then(
			(response) => {
				if (response) {
          this.id_tabung_kelulusan = response.id;
					this.no_rujukan_kelulusan = response.no_rujukan_kelulusan;
				}
			}
		);
	}

  addBencana() {
		const modalRef = this.modalService.open(PilihBencanaComponent, { size: 'xl' });
		modalRef.componentInstance.name = 'add';
    modalRef.result.then(
			(response) => {
				if (response) {
          this.bayaranTerus.id_bencana = response.id;
					this.namaBencana = response.nama_bencana;
          this.modelTarikhBencana = this.fromModel(response.tarikh_bencana.format('YYYY-MM-DD'));
				}
			}
		);
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

  save() {
    if(this.id_kategori_penerima == 1){
      this.bayaranTerus.id_agensi = null;
      this.bayaranTerus.id_kementerian = null;
    }
    if(this.id_kategori_penerima == 2){
      this.bayaranTerus.id_negeri = null;
      this.bayaranTerus.id_kementerian = null;
    }
    if(this.id_kategori_penerima == 3){
      this.bayaranTerus.id_negeri = null;
      this.bayaranTerus.id_agensi = null;
    }
    if(this.modelTarikh){
      this.tarikhBayaran = this.toModel(this.modelTarikh);
      this.bayaranTerus.tarikh = moment(this.tarikhBayaran, "YYYY-MM-DD");
    }
    if(this.modelTarikhBencana){
      this.tarikhBencana = this.toModel(this.modelTarikhBencana);
      this.bayaranTerus.tarikh_bencana = moment(this.tarikhBencana, "YYYY-MM-DD");
    }
    this.bayaranTerus.id_tabung_kelulusan = this.id_tabung_kelulusan;
    this.bayaranTerus.no_rujukan_kelulusan = this.no_rujukan_kelulusan;

    if(!this.idBayaranTerus) {
      this.tabungBayaranTerusServiceProxy
			.createOrEdit(this.bayaranTerus)
			.pipe()
			.subscribe((result) => {
        this.output.message = result.message;
        if(this.output.message == "No. Baucer yang Anda Masukkan Telah Wujud."){
          this._confirmationService.open({
            title: 'Tidak Berjaya',
            message: result.message,
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
        else if(this.output.message == "Tabung Bayaran Terus Berjaya Ditambah"){
          const dialogRef = this._confirmationService.open({
            title: 'Berjaya',
            message: 'Maklumat Bayaran Secara Terus Berjaya Ditambah.',
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
            this.router.navigateByUrl('/app/tabung/bayaran-terus/senarai');
          });
        }else{
          this._confirmationService.open({
            title: 'Tidak Berjaya',
            message: result.message,
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


    else if(this.idBayaranTerus){
      this.tabungBayaranTerusServiceProxy
			.createOrEdit(this.bayaranTerus)
			.pipe()
			.subscribe((result) => {
        this.output.message = result.message;
        if(this.output.message == 'Tabung Bayaran Terus Berjaya Dikemaskini'){
          const dialogRef = this._confirmationService.open({
            title: 'Berjaya',
            message: this.output.message,
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
            this.router.navigateByUrl('/app/tabung/bayaran-terus/senarai');
          });
        }
        else{
          this._confirmationService.open({
            title: 'Tidak Berjaya',
            message: result.message,
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
