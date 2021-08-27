import { Component, OnInit, ViewEncapsulation, Input, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { TabungKelulusanServiceProxy } from 'src/app/shared/proxy/service-proxies';

@Component({
  selector: 'app-pilih-pembayaran',
  templateUrl: './pilih-pembayaran.component.html',
  encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class PilihPembayaranComponent implements OnInit {
  @ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

	@Input() name;

  filter: string;
  filterTabung: number;
  filterJenisBencana: number;

  rows = [
		{
      jenis_bayaran: 'SKB', no_rujukan_bayaran: 'SKB078', perihal: 'Kecemasan', jumlah: 'RM 100000.00'
		},
    {
      jenis_bayaran: 'TERUS', no_rujukan_bayaran: 'TRS312', perihal: 'Tiada', jumlah: 'RM 93000.00'
		}
	];

	constructor(
    config: NgbModalConfig,
    public activeModal: NgbActiveModal,
    private _tabungKelulusanServiceProxy: TabungKelulusanServiceProxy
  ) {
		config.backdrop = 'static';
		config.keyboard = false;
		this.primengTableHelper = new PrimengTableHelper();
	}

	ngOnInit(): void {}

  getPembayaran(event?: LazyLoadEvent) {
		if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

    this.primengTableHelper.showLoadingIndicator();
		this.primengTableHelper.totalRecordsCount = this.rows.length;
		this.primengTableHelper.records = this.rows;
		this.primengTableHelper.hideLoadingIndicator();
	}

  select(jenis_bayaran) {
		this.activeModal.close({
      nama_pembayaran: jenis_bayaran
    });
	}
}
