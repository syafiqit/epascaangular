import { OnInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbCalendar, NgbDateStruct, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { TambahKetuaIsiRumahComponent } from '../tambah-ketua-isi-rumah/tambah-ketua-isi-rumah.component';
import {
  CreateOrEditTabungBwiDto,
  InputBwiBayaranDto,
  InputBwiKawasanDto,
  InputCreateTabungBwiDto,
  RefJenisBwiServiceProxy,
  TabungBwiServiceProxy
} from 'src/app/shared/proxy/service-proxies';
import { PilihPembayaranComponent } from '../pilih-pembayaran/pilih-pembayaran.component';
import { swalError, swalSuccess } from '@shared/sweet-alert/swal-constant';
import { fadeVerticalAnimation } from '@app/shared/data/router-animation/fade-vertical-animation';
import { TambahBantuanComponent } from '../tambah-bantuan/tambah-bantuan.component';
import { PilihBencanaBwiComponent } from '../pilih-bencana/pilih-bencana-bwi.component';
import { ConfirmationService } from '@services/confirmation';
@Component({
	selector: 'app-tambah-edit-wang-ihsan',
	templateUrl: './tambah-edit-wang-ihsan.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal, NgbActiveModal],
  animations: [fadeVerticalAnimation]
})
export class TambahEditWangIhsanComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;
  primengTableHelperBantuan: PrimengTableHelper;

  tabungBwi: InputCreateTabungBwiDto = new InputCreateTabungBwiDto();
  bwi: CreateOrEditTabungBwiDto = new CreateOrEditTabungBwiDto();
  bwi_kawasan: InputBwiKawasanDto[] = [];
  bwi_bayaran: InputBwiBayaranDto[] = [];

  nama_pembayaran:string;
  bwiType: any;
  id_bencana: number;
  nama_bencana: string;
  tarikh_bencana: string;
  bayaran: number = 0;
  totalBayaran: number = 0;
  idJenisBayaran: number;
  id_tabung_kelulusan: number;
  existingId: number;

  pembayaran = [];
  bantuan = [];
  rows = [];
  saving = false;
  jumlahKir = this.rows.length;
  tarikhKejadian: string;
  jenisBwi: any;

  date = new Date();
  modelBencana: string;
  modelKejadian: NgbDateStruct;
  today = this.calendar.getToday();
  readonly DELIMITER = '-';

	constructor(
    private router: Router,
    config: NgbModalConfig,
    private calendar: NgbCalendar,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private _tabungBwiServiceProxy: TabungBwiServiceProxy,
    private _refJenisBwiServiceProxy: RefJenisBwiServiceProxy,
    private _confirmationService: ConfirmationService,
  ) {
		config.backdrop = 'static';
		config.keyboard = false;
		this.primengTableHelper = new PrimengTableHelper();
    this.primengTableHelperBantuan = new PrimengTableHelper();
	}

	ngOnInit(): void {
    this.getJenisBwi();
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

	getPembayaran(event?: LazyLoadEvent) {
		if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this.primengTableHelper.totalRecordsCount = this.pembayaran.length;
		this.primengTableHelper.records = this.pembayaran;
		this.primengTableHelper.hideLoadingIndicator();
	}

	getBantuan(event?: LazyLoadEvent) {
		if (this.primengTableHelperBantuan.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelperBantuan.showLoadingIndicator();
		this.primengTableHelperBantuan.totalRecordsCount = this.bantuan.length;
		this.primengTableHelperBantuan.records = this.bantuan;
		this.primengTableHelperBantuan.hideLoadingIndicator();
	}

	getKir(event?: LazyLoadEvent) {
		if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this.primengTableHelper.totalRecordsCount = this.rows.length;
		this.primengTableHelper.records = this.rows;
		this.primengTableHelper.hideLoadingIndicator();
	}

  getJenisBwi(filter?) {
		this._refJenisBwiServiceProxy.getRefJenisBwiForDropdown(filter).subscribe((result) => {
			this.jenisBwi = result.items;
		});
	}

  addKirModal() {
		const modalRef = this.modalService.open(TambahKetuaIsiRumahComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
    modalRef.componentInstance.kategori = 1;

    modalRef.result.then(
			(response) => {
				if (response) {
          this.rows.push({
            id: response.id,
            no_rujukan_bayaran: response.no_rujukan_bayaran,
            perihal: response.perihal,
            no_rujukan_kelulusan: response.no_rujukan_kelulusan,
            jumlah: response.jumlah
          });
          this.getKir();
				}
			},
			() => {}
		);
	}

  deleteKir(id) {
    const index = this.rows.indexOf(id);
    this.rows.splice(index, 1);
    this.getKir();
	}

	reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}

	pilihPembayaran() {
      const modalRef = this.modalService.open(PilihPembayaranComponent, { size: 'md' });
      if(this.id_tabung_kelulusan){
        modalRef.componentInstance.idTabungKelulusan = this.id_tabung_kelulusan;
      }
      modalRef.result.then(
        (response) => {
          this.id_tabung_kelulusan = response.id_tabung_kelulusan;
          if (response) {
            if(response.idSkb){
              this.existingId = this.pembayaran.find(e=> e.idSkb == response.idSkb);
              if(!this.existingId){
                this.pembayaran.push({
                  idSkb: response.idSkb,
                  id_tabung_kelulusan: response.id_tabung_kelulusan,
                  no_rujukan_bayaran: response.no_rujukan_bayaran,
                  perihal: response.perihal,
                  no_rujukan_kelulusan: response.no_rujukan_kelulusan,
                  jumlah: response.jumlah,
                });
                this.existingId = null;
              }else{
                swalError.fire('Tidak Berjaya','No. Rujukan SKB Telah Dipilih');
                this.existingId = null;
              }

            }else if(response.idTerus){
              this.existingId = this.pembayaran.find(e=> e.idTerus == response.idTerus);
              if(!this.existingId){
                this.pembayaran.push({
                  idTerus: response.idTerus,
                  id_tabung_kelulusan: response.id_tabung_kelulusan,
                  no_rujukan_bayaran: response.no_rujukan_bayaran,
                  perihal: response.perihal,
                  no_rujukan_kelulusan: response.no_rujukan_kelulusan,
                  jumlah: response.jumlah,
                });
                this.existingId = null;
              }else{
                swalError.fire('Tidak Berjaya','No. Rujukan Terus Telah Dipilih');
                this.existingId = null;
              }
            }
            this.idJenisBayaran = response.idJenisBayaran;
            this.getPembayaran();
          }
        },
        () => {}
      );

	}

  padamPembayaran(id){
    let index = this.pembayaran.indexOf(id);
    this.pembayaran.splice(index, 1);
    this.primengTableHelper.totalRecordsCount = this.pembayaran.length;
    if(this.primengTableHelper.totalRecordsCount == 0){
      this.idJenisBayaran = undefined;
    }
  }

	pilihJenisBencana() {
		const modalRef = this.modalService.open(PilihBencanaBwiComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
    modalRef.result.then(
			(response) => {
				if (response) {
          this.id_bencana = response.id;
          this.nama_bencana = response.nama_bencana;
          this.modelBencana =  response.tarikh_bencana.format('YYYY-MM-DD');
				}
			}
		);
	}

  addBantuan() {
		const modalRef = this.modalService.open(TambahBantuanComponent, { size: 'lg' });
    modalRef.componentInstance.id = this.id_bencana;
    modalRef.result.then(
			(response) => {
				if (response) {
          this.bantuan.push({
            id_negeri: response.id_negeri,
            id_daerah: response.id_daerah,
            nama_daerah: response.nama_daerah,
            nama_negeri: response.nama_negeri,
            jumlah_bayaran: response.jumlah_bayaran
          });
          this.totalBayaranBwi();
          this.getBantuan();
				}
			},
			() => {}
		);
  }

  totalBayaranBwi(){
    this.totalBayaran = 0;
    this.bantuan.forEach(e=>{
      this.totalBayaran += parseFloat(e.jumlah_bayaran);
    })
  }

	save() {
    this.saving = true;

    for(let i = 0; i < this.pembayaran.length; i++){
      const bayaranBwi = new InputBwiBayaranDto();
      if(this.pembayaran[i].idSkb){
        bayaranBwi.id_skb = this.pembayaran[i].idSkb;
        this.bwi_bayaran.push(bayaranBwi);
      }
      else if(this.pembayaran[i].idTerus){
        bayaranBwi.id_terus = this.pembayaran[i].idTerus;
        this.bwi_bayaran.push(bayaranBwi);
      }
    }

    for(let i = 0; i < this.bantuan.length; i++){
      const kawasanBwi = new InputBwiKawasanDto();
      kawasanBwi.id_daerah = this.bantuan[i].id_daerah;
      kawasanBwi.id_negeri = this.bantuan[i].id_negeri;
      kawasanBwi.jumlah_bwi = this.bantuan[i].jumlah_bayaran;
      this.bwi_kawasan.push(kawasanBwi);
    }

    this.bwi.id_bencana = this.id_bencana;
    this.tabungBwi.bwi = this.bwi;
    this.tabungBwi.bwi_bayaran = this.bwi_bayaran;
    this.tabungBwi.bwi_kawasan = this.bwi_kawasan;
    this.tabungBwi.id_kelulusan = this.id_tabung_kelulusan;

    this._tabungBwiServiceProxy
			.createOrEdit(this.tabungBwi)
			.pipe()
			.subscribe((result) => {
        const dialogRef = this._confirmationService.open({
          title: 'Berjaya',
          message: 'Maklumat Bantuan Wang Ihsan Berjaya Dihantar.',
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
          this.router.navigateByUrl('/app/tabung/senarai-wang-ihsan');
        });

			});
	}
}
