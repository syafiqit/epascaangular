import { Component, OnInit, ViewEncapsulation, Input, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { TabungKelulusanServiceProxy } from 'src/app/shared/proxy/service-proxies';

@Component({
	selector: 'app-tambah-no-rujukan',
	templateUrl: './tambah-no-rujukan.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class TambahNoRujukanComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

	@Input() name;

  filter: string;
  filterTabung: number;
  filterJenisBencana: number;

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

	getDisaster(event?: LazyLoadEvent) {
		if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this._tabungKelulusanServiceProxy
			.getAll(
				this.filter,
        this.filterTabung,
        this.filterJenisBencana,
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

  select(id, no_rujukan_kelulusan, id_jenis_bencana, id_tabung, nama_jenis_bencana, rujukan_surat, nama_tabung, perihal_surat) {
		this.activeModal.close({
      id: id,
      no_rujukan_kelulusan: no_rujukan_kelulusan,
      id_jenis_bencana: id_jenis_bencana,
      id_tabung: id_tabung,
      nama_jenis_bencana: nama_jenis_bencana,
      rujukan_surat: rujukan_surat,
      nama_tabung: nama_tabung,
      perihal_surat: perihal_surat
    });
	}
}
