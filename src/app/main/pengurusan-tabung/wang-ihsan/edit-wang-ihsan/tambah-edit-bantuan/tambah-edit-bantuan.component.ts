import { Component, Input, OnInit, Output, ViewChild, EventEmitter} from '@angular/core';
import { PrimengTableHelper } from '@app/shared/helpers/PrimengTableHelper';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { CreateOrEditTabungBwiKawasanDto, RefDaerahServiceProxy, RefNegeriServiceProxy, TabungBwiKawasanServiceProxy } from '@app/shared/proxy/service-proxies';
import { finalize } from 'rxjs/operators';
import { TambahEditKawasanBantuanComponent } from '../tambah-edit-kawasan-bantuan/tambah-edit-kawasan-bantuan.component';
import { ConfirmationService } from '@app/shared/services/confirmation';

@Component({
  selector: 'app-tambah-edit-bantuan',
  templateUrl: './tambah-edit-bantuan.component.html'
})
export class TambahEditBantuanComponent implements OnInit {
  @Input() public idBwi: number;
  @Input() public idBencana: number;
  @Input() public idJenisBwi: number;
  @Input() public jumlahPembayaran: number;
  @Input() public jumlahBantuan: number;
  @Output() jumlah_bantuan_padam = new EventEmitter<{}>();
  @Output() jumlah_bantuan_tambah = new EventEmitter<{}>();

  @ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

  primengTableHelper: PrimengTableHelper;
  public isCollapsed = false;
  states: any;
  districts: any;
  filterNegeri: number;
  filterDaerah: number;
  filter: string;
  idDaerah: number;
  idNegeri: number;
  jumlahDiberi: number;
  temporaryNumber: number = 0;
  idTemp: number;

  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private _confirmationService: ConfirmationService,
    private _refNegeriServiceProxy: RefNegeriServiceProxy,
    private _refDaerahServiceProxy: RefDaerahServiceProxy,
    private _refTabungBwiKawasanServiceProxy: TabungBwiKawasanServiceProxy,
  ) {
    this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
   }

  ngOnInit(): void {
    this.getNegeri();
    this.getDaerah();
  }

	getBantuan(event?: LazyLoadEvent) {
		this.primengTableHelper.showLoadingIndicator();
		this._refTabungBwiKawasanServiceProxy
			.getAllKawasanByIdBwi(
				this.filter ?? undefined,
        this.idBwi,
        this.filterNegeri ?? undefined,
        this.filterDaerah ?? undefined,
				this.primengTableHelper.getSorting(this.dataTable),
				this.primengTableHelper.getSkipCount(this.paginator, event),
				this.primengTableHelper.getMaxResultCount(this.paginator, event)
			)
      .pipe(finalize(()=>{
        this.primengTableHelper.hideLoadingIndicator();
      }))
			.subscribe((result) => {
				this.primengTableHelper.totalRecordsCount = result.total_count;
				this.primengTableHelper.records = result.items;
			});
	}

  addBantuan() {
		const modalRef = this.modalService.open(TambahEditKawasanBantuanComponent, { size: 'lg' });
    modalRef.componentInstance.id = this.idBencana;
    modalRef.result.then(
			(response) => {
        this.idDaerah = response.id_daerah;
        this.idNegeri = response.id_negeri;
        this.jumlahDiberi = response.jumlah_bayaran;

				if (response) {
          this.temporaryNumber = Number(response.jumlah_bayaran);
          this.jumlahBantuan = Number(this.jumlahBantuan) + this.temporaryNumber;

            this.primengTableHelper.records.push({
              id_temp: this.primengTableHelper.records.length + 1,
              id_negeri: response.id_negeri,
              id_daerah: response.id_daerah,
              nama_daerah: response.nama_daerah,
              nama_negeri: response.nama_negeri,
              jumlah_bwi: response.jumlah_bayaran
            });
            this.primengTableHelper.totalRecordsCount = this.primengTableHelper.records.length;
            this.getJumlahBantuanTambah(this.primengTableHelper.records.length, this.jumlahDiberi, this.idDaerah, this.idNegeri, this.jumlahBantuan);

				}
			},
			() => {}
		);
  }

  padamBantuan(id?, idTemp?, jumlah?) {

    if(idTemp){
      this.idTemp = idTemp;
      this.jumlahBantuan = this.jumlahBantuan - Number(jumlah);
      this.primengTableHelper.records.splice(this.primengTableHelper.records.findIndex(e=> e.id_temp == idTemp), 1);
      this.primengTableHelper.totalRecordsCount = this.primengTableHelper.records.length;
      this.getJumlahBantuanPadam(this.idTemp, this.jumlahDiberi, this.idDaerah, this.idNegeri, this.jumlahBantuan);
    }else{
      const dialogRef = this._confirmationService.open({
        title: 'Anda Pasti?',
        message: 'Adakah anda pasti ingin memadam Bantuan Kawasan ini?',
        icon: {
          show: true,
          name: 'help-circle',
          color: 'warning'
        },
        actions: {
          confirm: {
            show: true,
            label: 'Ya',
            color: 'primary'
          },
          cancel: {
            show: true,
            label: 'Tidak'
          }
        },
        dismissible: true
      });dialogRef.afterClosed().subscribe((e) => {
        if(e === 'confirmed') {

          this.primengTableHelper.records.splice(this.primengTableHelper.records.findIndex(e=> e.id == id), 1);

          this._refTabungBwiKawasanServiceProxy.delete(id).subscribe((result)=>{
            if(result.message == "Bantuan Kawasan Wang Ihsan Berjaya Dibuang"){
              this.jumlahBantuan = this.jumlahBantuan - Number(jumlah);
              const dialogRef = this._confirmationService.open({
                title: 'Berjaya',
                message: "Bantuan Kawasan Wang Ihsan Berjaya Dipadam.",
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
                this.getJumlahBantuanPadam(this.idTemp, this.jumlahDiberi, this.idDaerah, this.idNegeri, this.jumlahBantuan);
                this.getBantuan();
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
          })
        }
      });
    }
  }

  getJumlahBantuanPadam(idTemp: number, jumlahDiberi: number, idDaerah: number, idNegeri: number, jumlahBantuan: number) {
    this.jumlah_bantuan_padam.emit({idTemp, jumlahDiberi, idDaerah, idNegeri, jumlahBantuan});
  }

  getJumlahBantuanTambah(idTemp: number, jumlahDiberi: number, idDaerah: number, idNegeri: number, jumlahBantuan: number) {
    this.jumlah_bantuan_tambah.emit({idTemp, jumlahDiberi, idDaerah, idNegeri, jumlahBantuan});
  }

  getDaerah(filter?) {
		this._refDaerahServiceProxy.getRefDaerahForDropdown(filter, this.filterNegeri).subscribe((result) => {
			this.districts = result.items;
		});
	}

  getNegeri(filter?) {
		this._refNegeriServiceProxy.getRefNegeriForDropdown(filter).subscribe((result) => {
			this.states = result.items;
		});
	}

  resetFilter() {
    this.filter = undefined;
    this.filterNegeri = undefined;
    this.filterDaerah = undefined;

    this.getBantuan();
  }


}
