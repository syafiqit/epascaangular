import { Component, OnInit, ViewEncapsulation, Input, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { TabungBayaranSkbServiceProxy, TabungBayaranTerusServiceProxy, TabungKelulusanServiceProxy } from 'src/app/shared/proxy/service-proxies';

@Component({
  selector: 'app-bwi-surat-kuasa-belanja',
  templateUrl: './bwi-surat-kuasa-belanja.component.html',
  encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class BwiSuratKuasaBelanjaComponent implements OnInit {
  @ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

  @Input() idBencana;
	@Input() name;
  @Input() idTabungKelulusan;

  filter: string;
  filterTabung: number;
  filterJenisBencana: number;
  idJenisBayaran: number = 1;

	constructor(
    config: NgbModalConfig,
    public activeModal: NgbActiveModal,
    private _tabungBayaranSkbServiceProxy: TabungBayaranSkbServiceProxy
  ) {
		config.backdrop = 'static';
		config.keyboard = false;
		this.primengTableHelper = new PrimengTableHelper();
	}

	ngOnInit(): void {}

  getPembayaran(event?: LazyLoadEvent) {
		this.primengTableHelper.showLoadingIndicator();
		this._tabungBayaranSkbServiceProxy
			.getAllSkbForLookupTable(
				this.filter,
        this.idTabungKelulusan ?? undefined,
        this.idBencana ?? undefined,
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

  select(id, id_tabung_kelulusan, no_rujukan_skb, perihal, no_rujukan_kelulusan, jumlah_siling_peruntukan) {
		this.activeModal.close({
      id: id,
      id_tabung_kelulusan: id_tabung_kelulusan,
      no_rujukan_bayaran: no_rujukan_skb,
      perihal: perihal,
      no_rujukan_kelulusan: no_rujukan_kelulusan,
      jumlah: jumlah_siling_peruntukan,
      idJenisBayaran: this.idJenisBayaran,
      idBencana: this.idBencana
    });
	}
}
