import { Component, OnInit, ViewEncapsulation, Input, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { TabungKelulusanServiceProxy } from 'src/app/shared/proxy/service-proxies';

@Component({
  selector: 'app-pilih-rujukan-kelulusan',
  templateUrl: './pilih-rujukan-kelulusan.component.html',
  encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class PilihRujukanKelulusanComponent implements OnInit {
  @ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

	@Input() name;

  filter: string;
  filterTabung: number;
  filterKategori: number;
  terms$ = new Subject<string>();

	constructor(
    config: NgbModalConfig,
    public activeModal: NgbActiveModal,
    private _tabungKelulusanServiceProxy: TabungKelulusanServiceProxy
  ) {
		config.backdrop = 'static';
		config.keyboard = false;
		this.primengTableHelper = new PrimengTableHelper();
	}

	ngOnInit(): void {
    this.terms$.pipe(
      debounceTime(500), distinctUntilChanged()
    ).subscribe((filterValue: string) =>{
      this.filter = filterValue;
      this.getKelulusan();
    });
  }

  applyFilter(filterValue: string){
    this.terms$.next(filterValue);
  }

	getKelulusan(event?: LazyLoadEvent) {
		this.primengTableHelper.showLoadingIndicator();
		this._tabungKelulusanServiceProxy
			.getAllKelulusanForLookupTable(
				this.filter,
        this.filterTabung ?? undefined,
        this.filterKategori ?? undefined,
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
