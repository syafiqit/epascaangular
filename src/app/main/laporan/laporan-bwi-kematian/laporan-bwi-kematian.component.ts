import { OnInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FileDownloadService } from '@app/shared/services/file-download.service';
import { NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { LaporanServiceProxy, RefDaerahServiceProxy, RefNegeriServiceProxy } from 'src/app/shared/proxy/service-proxies';

@Component({
	selector: 'app-laporan-bwi-kematian',
	templateUrl: './laporan-bwi-kematian.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class LaporanBwiKematianComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;
	public isCollapsed = false;
  terms$ = new Subject<string>();

  states: any;
  districts: any;
  filter: string;
  filterNegeri: number;
  filterDaerah: number;
  filterYear: number;
  arrayYear:any[];

  total_kir: number;
  total_peruntukan: number;

	constructor(
    config: NgbModalConfig,
    private _laporanServiceProxy: LaporanServiceProxy,
    private _fileDownloadService: FileDownloadService,
    private _refNegeriServiceProxy: RefNegeriServiceProxy,
    private _refDaerahServiceProxy: RefDaerahServiceProxy
  ) {
		this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
    this.getNegeri();
    this.getDaerah();
	  this.generateArrayOfYears()

    this.terms$.pipe(
      debounceTime(500), distinctUntilChanged()
    ).subscribe((filterValue: string) =>{
      this.filter = filterValue;
      this.getBwiKematianReport();
    });
  }

  applyFilter(filterValue: string){
    this.terms$.next(filterValue);
  }

	getBwiKematianReport(event?: LazyLoadEvent) {
    if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this._laporanServiceProxy
			.getAllLaporanBwiKematian(
				this.filter,
        this.filterNegeri ?? undefined,
        this.filterDaerah ?? undefined,
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
        this.total_kir = result.total_kir;
        this.total_peruntukan = result.total_peruntukan;
			});
	}

  exportToExcel(){
    this._laporanServiceProxy.exportAllLaporanBwiKematianToExcel(
      this.filter,
      this.filterNegeri  ?? undefined,
      this.filterDaerah  ?? undefined,
      this.filterYear ?? undefined,
    ).subscribe(e=>{
      this._fileDownloadService.downloadTempFile(e);
    })
  }

  getNegeri(filter?) {
		this._refNegeriServiceProxy.getRefNegeriForDropdown(filter).subscribe((result) => {
			this.states = result.items;
		});
	}

  getDaerah(filter?) {
		this._refDaerahServiceProxy.getRefDaerahForDropdown(filter, this.filterNegeri).subscribe((result) => {
			this.districts = result.items;
		});
	}

	reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}

  resetFilter() {
    this.filter = undefined;
    this.filterNegeri = undefined;
    this.filterDaerah = undefined;
    this.filterYear = undefined;

    this.getBwiKematianReport();
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
