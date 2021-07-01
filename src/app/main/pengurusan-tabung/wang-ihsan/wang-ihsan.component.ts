import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import {
  RefDaerahServiceProxy,
  RefJenisBencanaServiceProxy,
  RefNegeriServiceProxy,
  TabungBwiServiceProxy
} from 'src/app/shared/proxy/service-proxies';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
@Component({
	selector: 'app-wang-ihsan',
	templateUrl: './wang-ihsan.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class WangIhsanComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

  filter: any;
  filterDaerah: number;
  filterNegeri: number;
  filterJenisBencana: number;
  terms$ = new Subject<string>();
  public isCollapsed = false;
  jenisBencana: any;
  daerah: any;
  negeri: any;
  idBwi: any;

	constructor(
    config: NgbModalConfig,
    private _activatedRoute: ActivatedRoute,
     private tabungBwiServiceProxy: TabungBwiServiceProxy,
     private _refJenisBencanaServiceProxy: RefJenisBencanaServiceProxy,
     private _refDaerahServiceProxy: RefDaerahServiceProxy,
     private _refNegeriServiceProxy: RefNegeriServiceProxy
  ) {
    this.idBwi = this._activatedRoute.snapshot.queryParams['id'];
		this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
    this.getJenisBencana();
    this.getDaerah();
    this.getNegeri();

    this.terms$.pipe(
      debounceTime(500), distinctUntilChanged()
    ).subscribe((filterValue: string) =>{
      this.filter = filterValue;
      this.getBantuanWangIhsan();
    });

  }

  applyFilter(filterValue: string){
    this.terms$.next(filterValue);
  }

	getBantuanWangIhsan(event?: LazyLoadEvent) {
    if (this.primengTableHelper.shouldResetPaging(event)) {
      this.paginator.changePage(0);
      return;
    }
    this.primengTableHelper.showLoadingIndicator();

    this.tabungBwiServiceProxy
    .getAll(
      this.filter,
      this.filterDaerah,
      this.filterNegeri,
      this.filterJenisBencana,
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

  getJenisBencana(filter?) {
		this._refJenisBencanaServiceProxy.getRefJenisBencanaForDropdown(filter).subscribe((result) => {
			this.jenisBencana = result.items;
		});
	}

  getDaerah(filter?) {
		this._refDaerahServiceProxy.getRefDaerahForDropdown(filter).subscribe((result) => {
			this.daerah = result.items;
		});
	}

  getNegeri(filter?) {
		this._refNegeriServiceProxy.getRefNegeriForDropdown(filter).subscribe((result) => {
			this.negeri = result.items;
		});
	}

  resetFilter() {
    this.filter = undefined;
    this.filterDaerah = undefined;
    this.filterNegeri = undefined;
    this.filterJenisBencana = undefined;
    this.getBantuanWangIhsan();
  }

	reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}
}
