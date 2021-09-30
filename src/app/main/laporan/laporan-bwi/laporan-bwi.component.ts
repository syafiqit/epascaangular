import { OnInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FileDownloadService } from '@app/shared/services/file-download.service';
import { NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import {
  LaporanServiceProxy,
  RefBencanaServiceProxy,
  RefDaerahServiceProxy,
  RefNegeriServiceProxy
} from 'src/app/shared/proxy/service-proxies';

@Component({
	selector: 'app-laporan-bwi',
	templateUrl: './laporan-bwi.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class LaporanBwiComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;
	public isCollapsed = false;
  terms$ = new Subject<string>();

  filter: string;
  filterBencana: number;
  filterNegeri: number;
  filterDaerah: number;
  filterYearEft: number;
  filterYearBencana: number;
  disasters: any;
  states: any;
  districts: any;
  arrayYear:any[];

	constructor(
    config: NgbModalConfig,
    private _laporanServiceProxy: LaporanServiceProxy,
    private _fileDownloadService: FileDownloadService,
    private _refBencanaServiceProxy: RefBencanaServiceProxy,
    private _refNegeriServiceProxy: RefNegeriServiceProxy,
    private _refDaerahServiceProxy: RefDaerahServiceProxy
  ) {
		this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
    this.getBencana();
    this.getNegeri();
    this.getDaerah();
    this.generateArrayOfYears();

    this.terms$.pipe(
      debounceTime(500), distinctUntilChanged()
    ).subscribe((filterValue: string) =>{
      this.filter = filterValue;
      this.getBwiReport();
    });
  }

  applyFilter(filterValue: string){
    this.terms$.next(filterValue);
  }

	getBwiReport(event?: LazyLoadEvent) {
    if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this._laporanServiceProxy
			.getAllLaporanBwi(
				this.filter,
        this.filterBencana ?? undefined,
        this.filterNegeri ?? undefined,
        this.filterDaerah ?? undefined,
        this.filterYearEft ?? undefined,
        this.filterYearBencana ?? undefined,
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
    this._laporanServiceProxy.exportAllLaporanBwiToExcel(
      this.filter,
      this.filterBencana  ?? undefined,
      this.filterNegeri ?? undefined,
      this.filterDaerah ?? undefined,
      this.filterYearEft ?? undefined,
      this.filterYearBencana ?? undefined,
    ).subscribe(e=>{
      this._fileDownloadService.downloadTempFile(e);
    })
  }

  getBencana(filter?) {
		this._refBencanaServiceProxy.getRefBencanaForDropdown(filter).subscribe((result) => {
			this.disasters = result.items;
		});
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
    this.filterBencana = undefined;
    this.filterNegeri = undefined;
    this.filterDaerah = undefined;
    this.filterYearEft = undefined;
    this.filterYearBencana = undefined;

    this.getBwiReport();
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
