import { Component, Input, OnInit, ViewChild, } from '@angular/core';
import { PrimengTableHelper } from '@app/shared/helpers/PrimengTableHelper';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { PilihPembayaranComponent } from '../../pilih-pembayaran/pilih-pembayaran.component';
import { TabungBwiBayaranServiceProxy } from '@app/shared/proxy/service-proxies';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-tambah-edit-pembayaran',
  templateUrl: './tambah-edit-pembayaran.component.html'
})
export class TambahEditPembayaranComponent implements OnInit {
  @Input() public idBwi: number;

  @ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

  primengTableHelper: PrimengTableHelper;

  rows = [];
  filter: string;

  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private _tabungBwiBayaranServiceProxy: TabungBwiBayaranServiceProxy
  ) {
    this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
   }

  ngOnInit(): void { }

	getBayaranBwi(event?: LazyLoadEvent) {
		if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this._tabungBwiBayaranServiceProxy
			.getAllBwiBayaranTerus(
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

	pilihPembayaran() {
		const modalRef = this.modalService.open(PilihPembayaranComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
    modalRef.componentInstance.kategori = 1;

    modalRef.result.then(
			(response) => {
				if (response) {
          this.primengTableHelper.records.push({
            id: response.id,
            no_rujukan_bayaran: response.no_rujukan_terus,
            perihal: response.perihal,
            no_rujukan_kelulusan: response.no_rujukan_kelulusan,
            jumlah: response.jumlah
          });
          this.getBayaranBwi();
				}
			},
			() => {}
		);
	}

}