import { OnInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import {
  LaporanServiceProxy,
  RefAgensiServiceProxy,
  RefKementerianServiceProxy
} from 'src/app/shared/proxy/service-proxies';
import { FileDownloadService } from '@app/shared/services/file-download.service';

@Component({
  selector: 'app-laporan-mangsa',
  templateUrl: './laporan-mangsa.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class LaporanMangsaComponent implements OnInit {

  @ViewChild('dataTable', { static: true }) dataTable: Table;
  @ViewChild('paginator', { static: true }) paginator: Paginator;

  primengTableHelper: PrimengTableHelper;
  public isCollapsed = false;
  terms$ = new Subject<string>();

  agencies: any;
  ministries: any;
  filter: string;
  filterAgensi: number;
  filterKementerian: number;
  filterYear: number;
  arrayYear:any[];

	constructor(
    config: NgbModalConfig,
    private _refKementerianServiceProxy: RefKementerianServiceProxy,
    private _refAgensiServiceProxy: RefAgensiServiceProxy,
    private _laporanServiceProxy: LaporanServiceProxy,
    private _fileDownloadService: FileDownloadService
  ) {
		this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
    this.getKementerian();
    this.getAgensi();
	  this.generateArrayOfYears();

    this.terms$.pipe(
      debounceTime(500), distinctUntilChanged()
    ).subscribe((filterValue: string) =>{
      this.filter = filterValue;
      this.getMangsaDaftar();
    });
  }

  applyFilter(filterValue: string){
    this.terms$.next(filterValue);
  }

	getMangsaDaftar(event?: LazyLoadEvent) {
    if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this._laporanServiceProxy
			.getAllMangsa(
				this.filter,
        this.filterAgensi ?? undefined,
        this.filterKementerian ?? undefined,
        this.filterYear ?? undefined,
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

  exportToExcel(){
    this._laporanServiceProxy.exportAllMangsaToExcel(
      this.filter,
      this.filterAgensi  ?? undefined,
      this.filterKementerian ?? undefined,
      this.filterYear ?? undefined
    ).subscribe(e=>{
      this._fileDownloadService.downloadTempFile(e);
    })
  }

  getKementerian(filter?) {
		this._refKementerianServiceProxy.getRefKementerianForDropdown(filter).subscribe((result) => {
			this.ministries = result.items;
		});
	}

  getAgensi(filter?) {
		this._refAgensiServiceProxy.getRefAgensiForDropdown(filter).subscribe((result) => {
			this.agencies = result.items;
		});
	}

	reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}

  resetFilter() {
    this.filter = undefined;
    this.filterAgensi = undefined;
    this.filterKementerian = undefined;
    this.filterYear = undefined;

    this.getMangsaDaftar();
  }

  generateArrayOfYears() {
    let max = new Date().getFullYear();
    let min = max - 9;
    let years = [];

    for (let i = max; i >= min; i--) {
      years.push(i)
    }
    this.arrayYear = years;
  }

}
