import { OnInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FileDownloadService } from '@app/shared/services/file-download.service';
import { NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { LaporanServiceProxy, RefKategoriBayaranServiceProxy } from 'src/app/shared/proxy/service-proxies';

@Component({
	selector: 'app-laporan-bayaran-terus',
	templateUrl: './laporan-bayaran-terus.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class LaporanBayaranTerusComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;
	public isCollapsed = false;
  terms$ = new Subject<string>();

  categories: any;
  filter: string;
  filterKategori: number;
  filterYear: number;
  arrayYear:any[];
  jumlah_bayaran_terus: number;
  kategori_negeri = "Negeri";
  kategori_agensi = "Agensi";
  kategori_kementerian = "Kementerian";

	constructor(
    config: NgbModalConfig,
    private _laporanServiceProxy: LaporanServiceProxy,
    private _fileDownloadService: FileDownloadService,
    private _refKategoriBayaranServiceProxy: RefKategoriBayaranServiceProxy
  ) {
		this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
    this.getKategori();
	  this.generateArrayOfYears();

    this.terms$.pipe(
      debounceTime(500), distinctUntilChanged()
    ).subscribe((filterValue: string) =>{
      this.filter = filterValue;
      this.getTerusReport();
    });
  }

  applyFilter(filterValue: string){
    this.terms$.next(filterValue);
  }

	getTerusReport(event?: LazyLoadEvent) {
    if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this._laporanServiceProxy
			.getAllLaporanBayaranTerus(
				this.filter,
        this.filterKategori ?? undefined,
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
        this.jumlah_bayaran_terus = result.jumlah_bayaran_terus;
			});
	}

  exportToExcel(){
    this._laporanServiceProxy.exportAllBayaranTerusToExcel(
      this.filter,
      this.filterKategori  ?? undefined,
      this.filterYear ?? undefined,
    ).subscribe(e=>{
      this._fileDownloadService.downloadTempFile(e);
    })
  }

  getKategori(filter?) {
		this._refKategoriBayaranServiceProxy.getRefKategoriBayaranForDropdown(filter).subscribe((result) => {
			this.categories = result.items;
		});
	}

	reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}

  resetFilter() {
    this.filter = undefined;
    this.filterKategori = undefined;
    this.filterYear = undefined;

    this.getTerusReport();
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
