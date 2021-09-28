import { Component, Input, OnInit, Output, ViewChild, EventEmitter} from '@angular/core';
import { PrimengTableHelper } from '@app/shared/helpers/PrimengTableHelper';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { TabungBwiBayaranServiceProxy, UpdateBwiBayaranDto } from '@app/shared/proxy/service-proxies';
import { finalize } from 'rxjs/operators';
import { BwiSuratKuasaBelanjaComponent } from '../../pilih-pembayaran/bwi-surat-kuasa-belanja/bwi-surat-kuasa-belanja.component';
import { BwiBayaranSecaraTerusComponent } from '../../pilih-pembayaran/bwi-bayaran-secara-terus/bwi-bayaran-secara-terus.component';

@Component({
  selector: 'app-tambah-edit-pembayaran',
  templateUrl: './tambah-edit-pembayaran.component.html'
})
export class TambahEditPembayaranComponent implements OnInit {
  @Input() public idBwi: number;
  @Output() idBayaranTerus = new EventEmitter<number>();
  @Output() idBayaranSkb = new EventEmitter<number>();

  @ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

  primengTableHelperTerus: PrimengTableHelper;
  primengTableHelperSkb: PrimengTableHelper;
  bwi_bayaran: UpdateBwiBayaranDto[] = [];

  rows = [];
  bayaran_terus: number;
  filter: string;
  idTerus: number;
  idSkb: number;
  idTabungBayaranSkb: number;
  idTabungBayaranTerus: number;

  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private _tabungBwiBayaranServiceProxy: TabungBwiBayaranServiceProxy
  ) {
    this.primengTableHelperTerus = new PrimengTableHelper();
    this.primengTableHelperSkb = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
   }

  ngOnInit(): void {}

	getBayaranTerus(event?: LazyLoadEvent) {
		if (this.primengTableHelperTerus.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelperTerus.showLoadingIndicator();
		this._tabungBwiBayaranServiceProxy
			.getAllBwiBayaranTerus(
				this.filter,
        this.idBwi,
				this.primengTableHelperTerus.getSorting(this.dataTable),
				this.primengTableHelperTerus.getSkipCount(this.paginator, event),
				this.primengTableHelperTerus.getMaxResultCount(this.paginator, event)
			)
      .pipe(finalize(()=>{
        this.primengTableHelperTerus.hideLoadingIndicator();
      }))
			.subscribe((result) => {
				this.primengTableHelperTerus.totalRecordsCount = result.total_count;
				this.primengTableHelperTerus.records = result.items;
			});
	}

  getBayaranSkb(event?: LazyLoadEvent) {
		if (this.primengTableHelperSkb.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelperSkb.showLoadingIndicator();
		this._tabungBwiBayaranServiceProxy
			.getAllBwiBayaranSkb(
				this.filter,
        this.idBwi,
				this.primengTableHelperSkb.getSorting(this.dataTable),
				this.primengTableHelperSkb.getSkipCount(this.paginator, event),
				this.primengTableHelperSkb.getMaxResultCount(this.paginator, event)
			)
      .pipe(finalize(()=>{
        this.primengTableHelperSkb.hideLoadingIndicator();
      }))
			.subscribe((result) => {
				this.primengTableHelperSkb.totalRecordsCount = result.total_count;
				this.primengTableHelperSkb.records = result.items;
			});
	}

	pilihPembayaran() {
    if(this.primengTableHelperSkb.totalRecordsCount){
      const modalRef = this.modalService.open(BwiSuratKuasaBelanjaComponent, { size: 'lg' });
      modalRef.result.then(
        (response) => {
          this.idSkb = response.id;
          if (response) {
            this.primengTableHelperSkb.records.push({
              id: response.id,
              no_rujukan_skb: response.no_rujukan_bayaran,
              perihal: response.perihal,
              no_rujukan_kelulusan: response.no_rujukan_kelulusan,
              jumlah: response.jumlah,
              idJenisBayaran: response.idJenisBayaran
            });
            this.tambahPembayaranSkb(this.idSkb)
          }
        },
        () => {}
      );
    }

    if(this.primengTableHelperTerus.totalRecordsCount){
      const modalRef = this.modalService.open(BwiBayaranSecaraTerusComponent, { size: 'lg' });
      modalRef.result.then(
        (response) => {
          this.idTerus = response.id;
          if (response) {
            this.primengTableHelperTerus.records.push({
              id: response.id,
              no_rujukan_terus: response.no_rujukan_bayaran,
              perihal: response.perihal,
              no_rujukan_kelulusan: response.no_rujukan_kelulusan,
              jumlah: response.jumlah,
              idJenisBayaran: response.idJenisBayaran
            });
            this.tambahPembayaranTerus(this.idTerus)
          }
        },
        () => {}
      );
    }
	}

  tambahPembayaranTerus(value: number) {
    this.idBayaranTerus.emit(value);
  }

  tambahPembayaranSkb(value: number) {
    this.idBayaranSkb.emit(value);
  }

}
