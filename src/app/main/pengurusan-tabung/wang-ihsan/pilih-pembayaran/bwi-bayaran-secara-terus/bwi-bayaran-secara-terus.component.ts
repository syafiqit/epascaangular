import { Component, OnInit, ViewEncapsulation, Input, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { TabungBayaranTerusServiceProxy, TabungKelulusanServiceProxy } from 'src/app/shared/proxy/service-proxies';

@Component({
  selector: 'app-bwi-bayaran-secara-terus',
  templateUrl: './bwi-bayaran-secara-terus.component.html',
  encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class BwiBayaranSecaraTerusComponent implements OnInit {
  @ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

	@Input() name;
  @Input() idTabungKelulusan;

  filter: string;
  filterTabung: number;
  filterJenisBencana: number;
  idJenisBayaran: number = 2;

	constructor(
    config: NgbModalConfig,
    public activeModal: NgbActiveModal,
    private _tabungBayaranTerusServiceProxy: TabungBayaranTerusServiceProxy
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
		this._tabungBayaranTerusServiceProxy
			.getAllBayaranTerusLookupTable(
				this.filter,
        this.idTabungKelulusan ?? undefined,
				this.primengTableHelper.getSorting(this.dataTable),
				this.primengTableHelper.getSkipCount(this.paginator, event),
				this.primengTableHelper.getMaxResultCount(this.paginator, event)
			)
      .pipe(finalize(()=> {
        this.primengTableHelper.hideLoadingIndicator();
      }))
			.subscribe((result) => {
				this.primengTableHelper.totalRecordsCount = result.total_count;
				this.primengTableHelper.records = result.items;
			});
	}

  select(id, id_tabung_kelulusan, no_rujukan_terus, perihal, no_rujukan_kelulusan, jumlah) {
		this.activeModal.close({
      id: id,
      id_tabung_kelulusan: id_tabung_kelulusan,
      no_rujukan_bayaran: no_rujukan_terus,
      perihal: perihal,
      no_rujukan_kelulusan: no_rujukan_kelulusan,
      jumlah: jumlah,
      idJenisBayaran: this.idJenisBayaran
    });
	}
}
