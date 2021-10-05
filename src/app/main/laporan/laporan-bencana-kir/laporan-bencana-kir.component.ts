import { OnInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { SelectBencanaComponent } from '@app/main/pengurusan-mangsa/select-bencana/select-bencana.component';
import { FileDownloadService } from '@app/shared/services/file-download.service';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { LaporanServiceProxy, RefBencanaServiceProxy } from 'src/app/shared/proxy/service-proxies';

@Component({
	selector: 'app-laporan-bencana-kir',
	templateUrl: './laporan-bencana-kir.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class LaporanBencanaKirComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;
	public isCollapsed = false;
  terms$ = new Subject<string>();

  disasters: any;
  filter: string;
  filterBencana: number;
  filterYear: number;
  arrayYear:any[];
  nama_bencana: string;

	constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private _laporanServiceProxy: LaporanServiceProxy,
    private _fileDownloadService: FileDownloadService,
    private _refBencanaServiceProxy: RefBencanaServiceProxy
  ) {
		this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
    this.getBencana();
	  this.generateArrayOfYears()

    this.terms$.pipe(
      debounceTime(500), distinctUntilChanged()
    ).subscribe((filterValue: string) =>{
      this.filter = filterValue;
      this.getBencanaKirReport();
    });
  }

  applyFilter(filterValue: string){
    this.terms$.next(filterValue);
  }

	getBencanaKirReport(event?: LazyLoadEvent) {
    if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this._laporanServiceProxy
			.getAllLaporanBwiBencanaKir(
				this.filter,
        this.filterBencana ?? undefined,
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
    this._laporanServiceProxy.exportAllLaporanBwiBencanaKirToExcel(
      this.filter,
      this.filterBencana  ?? undefined,
      this.filterYear ?? undefined,
    ).subscribe(e=>{
      this._fileDownloadService.downloadTempFile(e);
    })
  }

  getBencana(filter?) {
		this._refBencanaServiceProxy.getRefBencanaForDropdown(filter).subscribe((result) => {
			this.disasters = result.items;
		});
	}

	reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}

  resetFilter() {
    this.filter = undefined;
    this.filterBencana = undefined;
    this.filterYear = undefined;
    this.nama_bencana = undefined;

    this.getBencanaKirReport();
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

	pilihBencana() {
		const modalRef = this.modalService.open(SelectBencanaComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
    modalRef.result.then(
			(response) => {
				if (response) {
          this.filterBencana = response.id;
          this.nama_bencana = response.nama_bencana;
				}
			}
		);
	}
}
