import { Component, Input, OnInit, Output, ViewChild, EventEmitter} from '@angular/core';
import { PrimengTableHelper } from '@app/shared/helpers/PrimengTableHelper';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { TabungBwiBayaranServiceProxy, UpdateBwiBayaranDto } from '@app/shared/proxy/service-proxies';
import { finalize } from 'rxjs/operators';
import { PilihPembayaranComponent } from '../../pilih-pembayaran/pilih-pembayaran.component';
import { ConfirmationService } from '@services/confirmation';

@Component({
  selector: 'app-tambah-edit-pembayaran',
  templateUrl: './tambah-edit-pembayaran.component.html'
})
export class TambahEditPembayaranComponent implements OnInit {
  @Input() public idBwi: number;
  @Input() public jumlahBayaranBwi: number;
  @Output() idBayaranTerus = new EventEmitter<{}>();
  @Output() idBayaranSkb = new EventEmitter<{}>();
  @Output() id_kelulusan = new EventEmitter<number>();
  @Output() jumlahBayaran = new EventEmitter<number>();
  @Output() jumlah_bayaran_padam = new EventEmitter<{}>();

  @ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

  primengTableHelper: PrimengTableHelper;
  primengTableHelperTerus: PrimengTableHelper;
  primengTableHelperSkb: PrimengTableHelper;
  bwi_bayaran: UpdateBwiBayaranDto[] = [];

  rows = [];
  bayaran_terus: number;
  filter: string;
  idTerus: number;
  idSkb: number;
  idPembayaran: number;
  idTabungBayaranSkb: number;
  idTabungBayaranTerus: number;
  existingId: number;
  idKelulusanKemaskini: number;
  jumlah_keseluruhan_bayaran: number;
  no_rujukan_bayaran: number;
  perihal: string;
  jumlah_bayaran: number;
  no_rujukan_kelulusan: string;
  jumlah: number;
  temporaryNumber: number = 0;
  jumlah_bwi_bayaran: number = 0;
  idTemp: number;

  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private _tabungBwiBayaranServiceProxy: TabungBwiBayaranServiceProxy,
    private _confirmationService: ConfirmationService
  ) {
    this.primengTableHelperTerus = new PrimengTableHelper();
    this.primengTableHelper = new PrimengTableHelper();
    this.primengTableHelperSkb = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
   }

  ngOnInit(): void {}

  getBayaran(event?: LazyLoadEvent) {
		this.primengTableHelper.showLoadingIndicator();
		this._tabungBwiBayaranServiceProxy
			.getAllBayaranSkbDanTerus(
				this.filter,
        this.idBwi,
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
        this.jumlah_keseluruhan_bayaran = result.jumlah_keseluruhan_bayaran;
        for(let i=0; i <= result.items.length - 1; i++){
          this.idKelulusanKemaskini = result.items[i].id_tabung_kelulusan;
          this.idKelulusan(this.idKelulusanKemaskini);
        }
        this.jumlahKeseluruhanBayaran(this.jumlah_keseluruhan_bayaran);
			});
	}

	pilihPembayaran() {
    const modalRef = this.modalService.open(PilihPembayaranComponent, { size: 'md' });
    modalRef.componentInstance.idTabungKelulusanKemaskini = this.idKelulusanKemaskini;
    modalRef.result.then(
      (response) => {
        this.jumlah_bayaran = Number(response.jumlah);
        this.no_rujukan_bayaran = response.no_rujukan_bayaran;
        this.perihal = response.perihal;
        this.no_rujukan_kelulusan = response.no_rujukan_kelulusan;
        this.jumlah = response.jumlah;

        if (response.idSkb) {
          this.existingId = this.primengTableHelper.records.find(e=> e.id_bayaran_skb == response.idSkb);
          this.idSkb = response.idSkb;
          if(!this.existingId){
            this.primengTableHelper.records.push({
              id_temp: this.primengTableHelper.records.length + 1,
              id_bayaran_skb: response.idSkb,
              no_rujukan_bayaran: response.no_rujukan_bayaran,
              perihal: response.perihal,
              no_rujukan_kelulusan: response.no_rujukan_kelulusan,
              jumlah: response.jumlah,
              idJenisBayaran: response.idJenisBayaran
            });
            this.existingId = null;
            this.primengTableHelper.totalRecordsCount = this.primengTableHelper.records.length;
            this.tambahPembayaranSkb(this.primengTableHelper.records.length, this.idSkb, this.no_rujukan_bayaran, this.perihal, this.no_rujukan_kelulusan, this.jumlah_bayaran);
          }else{
            this.jumlah_bayaran = this.jumlah_bayaran - response.jumlah;
            this._confirmationService.open({
              title: 'Tidak Berjaya',
              message: 'No. Rujukan SKB Telah Dipilih',
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
            this.existingId = null;
          }
        }
        else if (response.idTerus) {
          this.existingId = this.primengTableHelper.records.find(e=> e.id_bayaran_terus == response.idTerus);
          this.idTerus = response.idTerus;
          if(!this.existingId){
            this.primengTableHelper.records.push({
              id_temp: this.primengTableHelper.records.length + 1,
              id_bayaran_terus: response.idTerus,
              no_rujukan_bayaran: response.no_rujukan_bayaran,
              perihal: response.perihal,
              no_rujukan_kelulusan: response.no_rujukan_kelulusan,
              jumlah: response.jumlah,
              idJenisBayaran: response.idJenisBayaran
            });
            this.existingId = null;
            this.primengTableHelper.totalRecordsCount = this.primengTableHelper.records.length;
            this.tambahPembayaranTerus(this.primengTableHelper.records.length, this.idTerus, this.no_rujukan_bayaran, this.perihal, this.no_rujukan_kelulusan, this.jumlah_bayaran);
          }else{
            this.jumlah_bayaran = this.jumlah_bayaran - response.jumlah;
            this._confirmationService.open({
              title: 'Tidak Berjaya',
              message: 'No. Rujukan Terus Telah Dipilih',
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
            this.existingId = null;
          }
        }
      },
      () => {}
    );
	}

  padamPembayaran(id, idTemp?, jumlah?){
    if(idTemp){
      this.idTemp = idTemp;
      this.primengTableHelper.records.splice(this.primengTableHelper.records.findIndex(e=> e.id_temp == idTemp), 1);
      this.primengTableHelper.totalRecordsCount = this.primengTableHelper.records.length;
      this.getJumlahBayaranPadam(this.idTemp, this.jumlah_bayaran);
    }else{
      const dialogRef = this._confirmationService.open({
        title: 'Anda Pasti?',
        message: 'Adakah anda pasti ingin memadam Pembayaran ini?',
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

          this._tabungBwiBayaranServiceProxy.delete(id).subscribe((result)=>{
            if(result.message == "Pembayaran Wang Ihsan Berjaya Dibuang"){
              const dialogRef = this._confirmationService.open({
                title: 'Berjaya',
                message: result.message,
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
                this.getBayaran();
              });
            }
          })
        }
      });
    }

  }

  tambahPembayaranTerus(idTemp: number, idTerus: number, no_rujukan_bayaran: number, perihal: string, no_rujukan_kelulusan: string, jumlah_bayaran: number) {
    this.idBayaranTerus.emit({idTemp, idTerus, no_rujukan_bayaran, perihal, no_rujukan_kelulusan, jumlah_bayaran});
  }

  tambahPembayaranSkb(idTemp: number, idSkb: number, no_rujukan_bayaran: number, perihal: string, no_rujukan_kelulusan: string, jumlah_bayaran: number) {
    this.idBayaranSkb.emit({idTemp, idSkb, no_rujukan_bayaran, perihal, no_rujukan_kelulusan, jumlah_bayaran});
  }

  idKelulusan(value: number) {
    this.id_kelulusan.emit(value);
  }

  jumlahKeseluruhanBayaran(value: number){
    this.jumlahBayaran.emit(value);
  }

  getJumlahBayaranPadam(idTemp: number, jumlahBantuan: number) {
    this.jumlah_bayaran_padam.emit({idTemp, jumlahBantuan});
  }

}
