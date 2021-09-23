import { Component, Input, OnInit, Output, ViewChild, EventEmitter} from '@angular/core';
import { PrimengTableHelper } from '@app/shared/helpers/PrimengTableHelper';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { CreateOrEditTabungBwiKawasanDto, RefDaerahServiceProxy, RefNegeriServiceProxy, TabungBwiKawasanServiceProxy } from '@app/shared/proxy/service-proxies';
import { finalize } from 'rxjs/operators';
import { TambahEditKawasanBantuanComponent } from '../tambah-edit-kawasan-bantuan/tambah-edit-kawasan-bantuan.component';

@Component({
  selector: 'app-tambah-edit-bantuan',
  templateUrl: './tambah-edit-bantuan.component.html'
})
export class TambahEditBantuanComponent implements OnInit {
  @Input() public idBwi: number;
  @Input() public idBencana: number;
  @Input() public idJenisBwi: number;
  @Output() id_daerah = new EventEmitter<number>();
  @Output() id_negeri = new EventEmitter<number>();
  @Output() jumlah_diberi = new EventEmitter<number>();

  @ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

  primengTableHelper: PrimengTableHelper;
  public isCollapsed = false;
  states: any;
  districts: any;
  filterNegeri: number;
  filter: string;
  idDaerah: number;
  idNegeri: number;
  jumlahDiberi: number;

  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private _refNegeriServiceProxy: RefNegeriServiceProxy,
    private _refDaerahServiceProxy: RefDaerahServiceProxy,
    private _refTabungBwiKawasanServiceProxy: TabungBwiKawasanServiceProxy,
  ) {
    this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
   }

  ngOnInit(): void { }

	getBantuan(event?: LazyLoadEvent) {
		if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this._refTabungBwiKawasanServiceProxy
			.getAllKawasanByIdBwi(
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
          this.primengTableHelper.records.push({
            id_negeri: response.id_negeri,
            id_daerah: response.id_daerah,
            nama_daerah: response.nama_daerah,
            nama_negeri: response.nama_negeri,
            jumlah_bwi: response.jumlah_bayaran
          });
          this.getIdDaerah(this.idDaerah);
          this.getIdNegeri(this.idNegeri);
          this.getJumlahDiberi(this.jumlahDiberi);
				}
			},
			() => {}
		);
  }

  getIdDaerah(idDaerah: number) {
    this.id_daerah.emit(idDaerah);
  }
  getIdNegeri(idNegeri: number) {
    this.id_negeri.emit(idNegeri);
  }
  getJumlahDiberi(jumlahDiberi: number) {
    this.jumlah_diberi.emit(jumlahDiberi);
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
}
