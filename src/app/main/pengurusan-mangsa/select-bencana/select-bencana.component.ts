import { Component, OnInit, ViewEncapsulation, Input, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { RefBencanaServiceProxy } from 'src/app/shared/proxy/service-proxies';

@Component({
	selector: 'app-select-bencana',
	templateUrl: './select-bencana.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class SelectBencanaComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

	@Input() name;
	@Input() id_negeri;

  filter: string;
  filterTahun: number;
  filterBencana: string;
  filterJenis: number;
  filterNegeri: number;
  filterFromDate: string;
  filterToDate: string;
  terms$ = new Subject<string>();

	constructor(
    config: NgbModalConfig,
    public activeModal: NgbActiveModal,
    private _refBencanaServiceProxy: RefBencanaServiceProxy
  ) {
		this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
    this.terms$.pipe(
      debounceTime(500), distinctUntilChanged()
    ).subscribe((filterValue: string) =>{
      this.filter = filterValue;
      this.getBencana();
    });
  }

  applyFilter(filterValue: string){
    this.terms$.next(filterValue);
  }

	getBencana(event?: LazyLoadEvent) {
		this.primengTableHelper.showLoadingIndicator();
		this._refBencanaServiceProxy
			.getAll(
				this.filter,
        this.filterTahun,
        this.filterBencana,
        this.filterJenis,
        this.id_negeri,
        this.filterFromDate ?? undefined,
        this.filterToDate ?? undefined,
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

  select(id, tarikh_bencana, nama_bencana) {
		this.activeModal.close({
      id: id,
      tarikh_bencana: tarikh_bencana,
      nama_bencana: nama_bencana
    });
	}
}
