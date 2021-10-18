import { Component, OnInit, ViewEncapsulation, Input, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { RefBencanaServiceProxy, TabungServiceProxy } from 'src/app/shared/proxy/service-proxies';

@Component({
	selector: 'app-pilih-bencana-kelulusan',
	templateUrl: './pilih-bencana-kelulusan.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class PilihBencanaKelulusanComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

	@Input() name;

  filter: string;
  filterTahun: number;
  filterBencana: string;
  filterJenis: number;
  terms$ = new Subject<string>();

	constructor(
    config: NgbModalConfig,
    public activeModal: NgbActiveModal,
    private _refBencanaServiceProxy: TabungServiceProxy
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
			.getAllTabungForLookupTable(
				this.filter,
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

	select(id, nama_tabung) {
		this.activeModal.close({
		id: id,
		nama_tabung: nama_tabung
		});
	}
}
