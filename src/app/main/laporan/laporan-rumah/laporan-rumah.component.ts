import { OnInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  RefDaerahServiceProxy,
  RefNegeriServiceProxy
} from 'src/app/shared/proxy/service-proxies';

@Component({
	selector: 'app-laporan-rumah',
	templateUrl: './laporan-rumah.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class LaporanRumahComponent implements OnInit {
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
  filterBantuan: number;
  filterYear: number;
  arrayYear:any[];

	constructor(
    config: NgbModalConfig,
		private _activatedRoute: ActivatedRoute,
    private _refDaerahServiceProxy: RefDaerahServiceProxy,
    private _refNegeriServiceProxy: RefNegeriServiceProxy,
    private _laporanServiceProxy: LaporanServiceProxy,
    private _fileDownloadService: FileDownloadService
  ) {
		this.filterBantuan = this._activatedRoute.snapshot.queryParams['id'];
		this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
    this.getDaerah();
    this.getNegeri();
	  this.generateArrayOfYears();

    this.terms$.pipe(
      debounceTime(500), distinctUntilChanged()
    ).subscribe((filterValue: string) =>{
      this.filter = filterValue;
      this.getRumahReport();
    });
  }

  applyFilter(filterValue: string){
    this.terms$.next(filterValue);
  }

	getRumahReport(event?: LazyLoadEvent) {
		this.primengTableHelper.showLoadingIndicator();
		this._laporanServiceProxy
			.getAllMangsaBantuanRumah(
				this.filter,
        this.filterNegeri ?? undefined,
        this.filterDaerah ?? undefined,
        this.filterBantuan,
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
    this._laporanServiceProxy.exportAllMangsaBantuanRumahToExcel(
      this.filter,
      this.filterNegeri  ?? undefined,
      this.filterDaerah ?? undefined,
      this.filterBantuan,
      this.filterYear ?? undefined
    ).subscribe(e=>{
      this._fileDownloadService.downloadTempFile(e);
    })
  }

  getDaerah(filter?) {
		this._refDaerahServiceProxy.getRefDaerahForDropdown(filter, this.filterNegeri ?? undefined).subscribe((result) => {
			this.districts = result.items;
		});
	}

  getNegeri(filter?) {
		this._refNegeriServiceProxy.getRefNegeriForDropdown(filter).subscribe((result) => {
			this.states = result.items;
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

    this.getRumahReport();
    this.getDaerah();
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
