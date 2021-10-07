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
  RefAgensiServiceProxy,
  RefKategoriBayaranServiceProxy
} from 'src/app/shared/proxy/service-proxies';

@Component({
	selector: 'app-laporan-skb',
	templateUrl: './laporan-skb.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class LaporanSkbComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;
	public isCollapsed = false;
  terms$ = new Subject<string>();

  filter: string;
  filterAgensi: number;
  filterKategori: number;
  filterStatus: number;
  agencies: any;
  categories: any;

  jumlah_siling_peruntukan: number;
  jumlah_baki_peruntukan: number;
  total_jumlah_keseluruhan: number;

  statuses = [
    { id: 1, status: 'Aktif' },
    { id: 2, status: 'Tamat Tempoh' },
    { id: 3, status: 'Lanjut' }
  ];

	constructor(
    config: NgbModalConfig,
    private _fileDownloadService: FileDownloadService,
    private _laporanServiceProxy: LaporanServiceProxy,
    private _refAgensiServiceProxy: RefAgensiServiceProxy,
    private _refKategoriBayaranServiceProxy: RefKategoriBayaranServiceProxy
  ) {
		this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
    this.getAgensi();
    this.getKategori();

    this.terms$.pipe(
      debounceTime(500), distinctUntilChanged()
    ).subscribe((filterValue: string) =>{
      this.filter = filterValue;
      this.getSkbReport();
    });
  }

  applyFilter(filterValue: string){
    this.terms$.next(filterValue);
  }

	getSkbReport(event?: LazyLoadEvent) {
    if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this._laporanServiceProxy
			.getAllLaporanSkb(
				this.filter,
        this.filterAgensi ?? undefined,
        this.filterKategori ?? undefined,
        this.filterStatus ?? undefined,
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
        this.jumlah_siling_peruntukan = result.jumlah_siling_peruntukan;
        this.jumlah_baki_peruntukan = result.jumlah_baki_peruntukan;
        this.total_jumlah_keseluruhan = result.total_jumlah_keseluruhan;
			});
	}

  exportToExcel(){
    this._laporanServiceProxy.exportAllLaporanSkbToExcel(
      this.filterAgensi ?? undefined,
      this.filterKategori  ?? undefined,
      this.filterStatus ?? undefined,
    ).subscribe(e=>{
      this._fileDownloadService.downloadTempFile(e);
    })
  }

  getAgensi(filter?) {
		this._refAgensiServiceProxy.getRefAgensiForDropdown(filter).subscribe((result) => {
			this.agencies = result.items;
		});
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
    this.filterAgensi = undefined;
    this.filterKategori = undefined;
    this.filterStatus = undefined;

    this.getSkbReport();
  }
}
