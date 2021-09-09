import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbCalendar, NgbDateStruct, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { CreateOrEditTabungBayaranTerusDto, OutputCreateBayaranTerusDto, RefBencanaServiceProxy, RefJenisBencanaServiceProxy, TabungBayaranTerusServiceProxy, TabungServiceProxy } from 'src/app/shared/proxy/service-proxies';
import { PilihanRujukanKelulusanComponent } from '../../skb/pilihan-rujukan-kelulusan/pilihan-rujukan-kelulusan.component';
import { PilihBencanaComponent } from '../pilih-bencana/pilih-bencana.component';
import { PilihRujukanKelulusanComponent } from '../pilih-rujukan-kelulusan/pilih-rujukan-kelulusan.component';
import { PilihTabungComponent } from '../pilih-tabung/pilih-tabung.component';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { swalError, swalSuccess } from '@shared/sweet-alert/swal-constant';
@Component({
	selector: 'app-tambah-edit-bayaran-secara-terus',
	templateUrl: './tambah-edit-bayaran-secara-terus.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
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
  jenisBencana: any;
  id_jenis_bayaran: number;
  no_rujukan_kelulusan: string;
  namaTabung: string;
  namaBencana: string;
  modelTarikh: NgbDateStruct;
  today = this.calendar.getToday();
  readonly DELIMITER = '-';
  tarikhBayaran: string;
  idBayaranTerus: any;

  jenisBayaran = [
    { id: 1, nama_jenis_bayaran: 'BWI' },
    { id: 2, nama_jenis_bayaran: 'Pengoperasian' }
  ];

  kategori = [
    { id: 1, nama_kategori: 'Covid' },
    { id: 2, nama_kategori: 'Bukan Covid' }
  ];

	constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private calendar: NgbCalendar,
    private router: Router,
    private _activatedRoute: ActivatedRoute,
    private tabungBayaranTerusServiceProxy: TabungBayaranTerusServiceProxy,
    private _refBencanaServiceProxy: RefBencanaServiceProxy,
    private _refJenisBencanaServiceProxy: RefJenisBencanaServiceProxy
    ) {
    this.idBayaranTerus = this._activatedRoute.snapshot.queryParams['id'];
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
    this.show();
    this.getBencana();
    this.getKategoriBencana();
  }

  show(){
    if (!this.idBayaranTerus) {
			this.bayaranTerus = new CreateOrEditTabungBayaranTerusDto();
		} else {
			this.tabungBayaranTerusServiceProxy.getTabungBayaranTerusForEdit(this.idBayaranTerus).subscribe((result) => {
				this.bayaranTerus = result.tabung_bayaran_terus;
        // this.no_rujukan_kelulusan = result.rujukan_kelulusan_terus.no_rujukan_kelulusan;
        // this.namaTabung = result.nama_tabung;
        // this.namaBencana = result.nama_bencana;
        if(result.tabung_bayaran_terus.tarikh){
          this.modelTarikh = this.fromModel(result.tabung_bayaran_terus.tarikh.format('YYYY-MM-DD'));
        }
			});
		}
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

	addRujukanKelulusan() {
		const modalRef = this.modalService.open(PilihRujukanKelulusanComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
    modalRef.result.then(
			(response) => {
				if (response) {
          this.bayaranTerus.id_tabung_kelulusan = response.id;
					this.no_rujukan_kelulusan = response.no_rujukan_kelulusan;
				}
			}
		);
	}

  addTabung() {
		const modalRef = this.modalService.open(PilihTabungComponent, { size: 'xl' });
		modalRef.componentInstance.name = 'add';
    modalRef.result.then(
			(response) => {
				if (response) {
          // this.bayaranTerus.id_tabung = response.id;
					this.namaTabung = response.nama_tabung;
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
    if(this.modelTarikh){
      this.tarikhBayaran = this.toModel(this.modelTarikh);
      this.bayaranTerus.tarikh = moment(this.tarikhBayaran, "YYYY-MM-DD");
    }

    if(!this.idBayaranTerus) {
      this.tabungBayaranTerusServiceProxy
			.createOrEdit(this.bayaranTerus)
			.pipe()
			.subscribe((result) => {
        this.output.message = result.message;
        if(this.output.message == "Tabung Bayaran Terus Berjaya Ditambah"){
          swalSuccess.fire('Berjaya!', 'Maklumat Bayaran Secara Terus Berjaya Ditambah.', 'success').then(() => {
            this.router.navigateByUrl('/app/tabung/senarai-bayaran-secara-terus');
          });
        }else{
          swalError.fire('Tidak Berjaya!', this.output.message, 'error');
        }
			});
    } else {
      this.tabungBayaranTerusServiceProxy
			.createOrEdit(this.bayaranTerus)
			.pipe()
			.subscribe((result) => {
        this.output.message = result.message;
        if(this.output.message == "Tabung Bayaran Terus Berjaya Ditambah"){
          swalSuccess.fire('Berjaya!', 'Maklumat Bayaran Secara Terus Berjaya Dikemaskini.', 'success').then(() => {
            this.router.navigateByUrl('/app/tabung/senarai-bayaran-secara-terus');
          });
        }else{
          swalError.fire('Tidak Berjaya!', this.output.message, 'error');
        }
			});
    }
  }
}
