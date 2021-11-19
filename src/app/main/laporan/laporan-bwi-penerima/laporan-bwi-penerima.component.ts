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
import {
  LaporanServiceProxy,
  RefDaerahServiceProxy,
  RefNegeriServiceProxy
} from 'src/app/shared/proxy/service-proxies';
@Component({
  selector: 'app-laporan-bwi-penerima',
  templateUrl: './laporan-bwi-penerima.component.html',
  encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class LaporanBwiPenerimaComponent implements OnInit {
  @ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;
	public isCollapsed = false;
  terms$ = new Subject<string>();

  states: any;
  districts: any;
  disasters: any;
  filter: string;
  filterNegeri: number;
  filterDaerah: number;
  filterBencana: number;
  filterYear: number;
  filterString: string;
  arrayYear:any[];
  nama_bencana: string;

	constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private _refDaerahServiceProxy: RefDaerahServiceProxy,
    private _refNegeriServiceProxy: RefNegeriServiceProxy,
    private _laporanServiceProxy: LaporanServiceProxy,
    private _fileDownloadService: FileDownloadService
  ) {
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
      this.getPenerimaBwi();
    });
  }

  applyFilter(filterValue: string){
    this.terms$.next(filterValue);
  }

	getPenerimaBwi(event?: LazyLoadEvent) {
    if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this._laporanServiceProxy
			.getAllMangsaBantuanWangIhsan(
				this.filter,
        this.filterNegeri ?? undefined,
        this.filterDaerah ?? undefined,
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
    this._laporanServiceProxy.exportAllMangsaBantuanWangIhsanToExcel(
      this.filter,
      this.filterNegeri  ?? undefined,
      this.filterDaerah ?? undefined,
      this.filterBencana ?? undefined,
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

	reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}

  resetFilter() {
    this.filter = undefined;
    this.filterNegeri = undefined;
    this.filterDaerah = undefined;
    this.filterBencana = undefined;
    this.filterYear = undefined;
    this.nama_bencana = undefined;
    this.filterString = undefined;
    this.applyFilter(this.filterString);
    this.getPenerimaBwi();
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
