import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { swalError, swalSuccess, swalWarning } from '@app/shared/sweet-alert/swal-constant';
import { NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import {
  OutputCreateBayaranWaranDto,
  RefAgensiServiceProxy,
  TabungBayaranWaranServiceProxy,
  TabungServiceProxy
} from 'src/app/shared/proxy/service-proxies';

@Component({
	selector: 'app-waran',
	templateUrl: './waran.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class WaranComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;
	public isCollapsed = false;
  output: OutputCreateBayaranWaranDto = new OutputCreateBayaranWaranDto();

  terms$ = new Subject<string>();
	filter: string;
  filterAgensi: number;
  filterTabung: number;
  agencies: any;
  funds: any;

	constructor(
    config: NgbModalConfig,
    private _tabungBayaranWaranServiceProxy: TabungBayaranWaranServiceProxy,
    private _refAgensiServiceProxy: RefAgensiServiceProxy,
    private _tabungServiceProxy: TabungServiceProxy
  ) {
		this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
    this.getAgensi();
    this.getTabung();

    this.terms$.pipe(
      debounceTime(500), distinctUntilChanged()
    ).subscribe((filterValue: string) =>{
      this.filter = filterValue;
      this.getWarrant();
    });
  }

  applyFilter(filterValue: string){
    this.terms$.next(filterValue);
  }

	getWarrant(event?: LazyLoadEvent) {
    if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this._tabungBayaranWaranServiceProxy
			.getAll(
				this.filter,
        this.filterAgensi ?? undefined,
        this.filterTabung ?? undefined,
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

	reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}

  getAgensi(filter?) {
		this._refAgensiServiceProxy.getRefAgensiForDropdown(filter).subscribe((result) => {
			this.agencies = result.items;
		});
	}

  getTabung(filter?) {
		this._tabungServiceProxy.getTabungForDropdown(filter).subscribe((result) => {
			this.funds = result.items;
		});
	}

  resetFilter() {
    this.filter = undefined;
    this.filterAgensi = undefined;
    this.filterTabung = undefined;

    this.getWarrant();
  }

  deleteWaran(id){
		swalWarning.fire({
			title: 'Anda Pasti?',
			text: 'Adakah anda pasti ingin maklumat Bayaran Secara Waran ini?',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			cancelButtonText: 'Tidak',
			confirmButtonText: 'Ya'
		}).then((result) => {
			if (result.value) {
				this._tabungBayaranWaranServiceProxy.delete(id).subscribe((result)=>{
          this.output = result;
          if(this.output.message == "Waran Berjaya Dibuang"){
            swalSuccess.fire('Berjaya!', 'Maklumat Waran Dipilih Berjaya Dipadam!').then(()=>{
              this.getWarrant();
            });
          }else{
            swalError.fire('Tidak Berjaya!', this.output.message, 'error');
          }
        })
			}
		});
  }
}
