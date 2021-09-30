import { OnInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FileDownloadService } from '@app/shared/services/file-download.service';
import { NgbDateStruct, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { LaporanServiceProxy, RefAgensiServiceProxy, RefKategoriBayaranServiceProxy } from 'src/app/shared/proxy/service-proxies';

@Component({
  selector: 'app-laporan-waran',
  templateUrl: './laporan-waran.component.html',
  encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class LaporanWaranComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;
	public isCollapsed = false;
  funds: any;

  filter: any;
  filterAgensi: any;
  filterKategori: any;
  filterStatus: any;
  agensi: any;
  kategoriBayaran: any;

  date = new Date();
  modelMula: NgbDateStruct;
  modelTamat: NgbDateStruct;
  readonly DELIMITER = '-';
  terms$ = new Subject<string>();

  statusWaran = [
    { id: 1, status: 'Aktif' },
    { id: 2, status: 'Tamat Tempoh' },
    { id: 3, status: 'Lanjut' }
  ];

	constructor(
    config: NgbModalConfig,
    private _laporanServiceProxy: LaporanServiceProxy,
    private _refKategoriBayaranServiceProxy: RefKategoriBayaranServiceProxy,
    private _refAgensiServiceProxy: RefAgensiServiceProxy,
    private _fileDownloadService: FileDownloadService
  ) {
		this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
    this.getKategoriBayaran();
    this.getAgensi();

    this.terms$.pipe(
      debounceTime(500), distinctUntilChanged()
    ).subscribe((filterValue: any) =>{
      this.filter = filterValue;
      this.getWaranReport();
    });
  }

  applyFilter(filterValue: any){
    this.terms$.next(filterValue);
  }

  toModel(date: NgbDateStruct | null): string | null {
    return date ? date.year + this.DELIMITER + date.month + this.DELIMITER + date.day : null;
  }

	getWaranReport(event?: LazyLoadEvent) {
    if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this._laporanServiceProxy
			.getAllLaporanWaran(
				this.filter ?? undefined,
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
			});
	}

	reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}

  exportToExcel(){
    this._laporanServiceProxy.exportAllLaporanWaranToExcel(
      this.filterAgensi ?? undefined,
      this.filterKategori  ?? undefined,
      this.filterStatus ?? undefined,
    ).subscribe(e=>{
      this._fileDownloadService.downloadTempFile(e);
    })
  }

  getKategoriBayaran(filter?) {
		this._refKategoriBayaranServiceProxy.getRefKategoriBayaranForDropdown(filter).subscribe((result) => {
			this.kategoriBayaran = result.items;
		});
	}

  getAgensi(filter?) {
		this._refAgensiServiceProxy.getRefAgensiForDropdown(filter).subscribe((result) => {
			this.agensi = result.items;
		});
	}

  resetFilter() {
    this.filter = undefined;
    this.filterAgensi = undefined;
    this.filterKategori = undefined;
    this.filterStatus = undefined;

    this.getWaranReport();
  }
}

