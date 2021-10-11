import { Component, Input, OnInit, Output, ViewChild, EventEmitter} from '@angular/core';
import { PrimengTableHelper } from '@app/shared/helpers/PrimengTableHelper';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { TabungBwiBayaranServiceProxy, UpdateBwiBayaranDto } from '@app/shared/proxy/service-proxies';
import { finalize } from 'rxjs/operators';
import { PilihPembayaranComponent } from '../../pilih-pembayaran/pilih-pembayaran.component';
import { swalError } from '@app/shared/sweet-alert/swal-constant';
import { ConfirmationService } from '@services/confirmation';

@Component({
  selector: 'app-tambah-edit-pembayaran',
  templateUrl: './tambah-edit-pembayaran.component.html'
})
export class TambahEditPembayaranComponent implements OnInit {
  @Input() public idBwi: number;
  @Output() idBayaranTerus = new EventEmitter<number>();
  @Output() idBayaranSkb = new EventEmitter<number>();
  @Output() id_kelulusan = new EventEmitter<number>();
  @Output() jumlahBayaran = new EventEmitter<number>();

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
		if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

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
        if (response.idSkb) {
          this.existingId = this.primengTableHelper.records.find(e=> e.id_bayaran_skb == response.idSkb);
          this.idSkb = response.idSkb;
          if(!this.existingId){
            this.primengTableHelper.records.push({
              id: response.idSkb,
              no_rujukan_bayaran: response.no_rujukan_bayaran,
              perihal: response.perihal,
              no_rujukan_kelulusan: response.no_rujukan_kelulusan,
              jumlah: response.jumlah,
              idJenisBayaran: response.idJenisBayaran
            });
            this.existingId = null;
          }else{
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
          this.tambahPembayaranSkb(this.idSkb)
        }
        else if (response.idTerus) {
          this.existingId = this.primengTableHelper.records.find(e=> e.id_bayaran_terus == response.idTerus);
          this.idTerus = response.idTerus;
          if(!this.existingId){
            this.primengTableHelper.records.push({
              id: response.idTerus,
              no_rujukan_bayaran: response.no_rujukan_bayaran,
              perihal: response.perihal,
              no_rujukan_kelulusan: response.no_rujukan_kelulusan,
              jumlah: response.jumlah,
              idJenisBayaran: response.idJenisBayaran
            });
            this.existingId = null;
          }else{
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
          this.tambahPembayaranTerus(this.idTerus)
        }
      },
      () => {}
    );
	}

  tambahPembayaranTerus(value: number) {
    this.idBayaranTerus.emit(value);
  }

  tambahPembayaranSkb(value: number) {
    this.idBayaranSkb.emit(value);
  }

  idKelulusan(value: number) {
    this.id_kelulusan.emit(value);
  }

  jumlahKeseluruhanBayaran(value: number){
    this.jumlahBayaran.emit(value);
  }

}
