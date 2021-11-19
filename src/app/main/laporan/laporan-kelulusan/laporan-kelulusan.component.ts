import { OnInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { LaporanServiceProxy } from '@app/shared/proxy/service-proxies';
import { NgbDateStruct, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FileDownloadService } from '@app/shared/services/file-download.service';

@Component({
	selector: 'app-laporan-kelulusan',
	templateUrl: './laporan-kelulusan.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class LaporanKelulusanComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;
	public isCollapsed = false;

  date = new Date();
  modelMula: NgbDateStruct;
  modelTamat: NgbDateStruct;
  readonly DELIMITER = '-';
  filter: string;
  filterTahun: number;
  filterYear: number;
  filterPastYear: number;
  filterString: string;
  pastYear: string;
  arrayYear:any[];
  terms$ = new Subject<string>();
  fromDateMula:any;
  toDateMula:any;
  fromDateTamat:any;
  toDateTamat:any;
  filterFromDateMula:any;
  filterToDateMula:any;
  filterFromDateTamat:any;
  filterToDateTamat:any;
  chooseFromDateMula = false;
  chooseFromDateTamat = false;

  total_siling_peruntukan: number;
  total_peruntukan_diambil: number;
  total_belanja_covid_sebelum: number;
  total_belanja__bukan_covid_sebelum: number;
  total_skb_covid: number;
  total_skb_bukan_covid: number;
  total_terus_covid: number;
  total_terus_bukan_covid: number;
  total_belanja_covid_semasa: number;
  total_belanja__bukan_covid_semasa: number;
  total_waran: number;
  total_belanja: number;
  total_baki_peruntukan: number;

	constructor(
    config: NgbModalConfig,
    private _laporanServiceProxy: LaporanServiceProxy,
    private _fileDownloadService: FileDownloadService
  ) {
		this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
    this.generateArrayOfYears();

    this.terms$.pipe(
      debounceTime(500), distinctUntilChanged()
    ).subscribe((filterValue: string) =>{
      this.filter = filterValue;
      this.getKelulusanReport();
    });
  }
  applyFilter(filterValue: string){
    this.terms$.next(filterValue);
  }

  toModel(date: NgbDateStruct | null): string | null {
    return date ? date.year + this.DELIMITER + date.month + this.DELIMITER + date.day : null;
  }

	getKelulusanReport(event?: LazyLoadEvent) {
    if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();

    if(this.fromDateMula){
      this.changeDateToString();
    }

    if(this.fromDateTamat){
      this.changeDateToStringTamat();
    }

		this._laporanServiceProxy
			.getAllLaporanKelulusan(
				this.filter,
        this.filterFromDateMula ?? undefined,
        this.filterToDateMula ?? undefined,
        this.filterFromDateTamat ?? undefined,
        this.filterToDateTamat ?? undefined,
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
        this.total_siling_peruntukan = result.total_siling_peruntukan;
        this.total_peruntukan_diambil = result.total_peruntukan_diambil;
        this.total_belanja_covid_sebelum = result.total_belanja_covid_sebelum;
        this.total_belanja__bukan_covid_sebelum = result.total_belanja__bukan_covid_sebelum;
        this.total_skb_covid = result.total_skb_covid;
        this.total_skb_bukan_covid = result.total_skb_bukan_covid;
        this.total_terus_covid = result.total_terus_covid;
        this.total_terus_bukan_covid = result.total_terus_bukan_covid;
        this.total_belanja_covid_semasa = result.total_belanja_covid_semasa;
        this.total_belanja__bukan_covid_semasa = result.total_belanja__bukan_covid_semasa;
        this.total_waran = result.total_waran;
        this.total_belanja = result.total_belanja;
        this.total_baki_peruntukan = result.total_baki_peruntukan;
			});
	}

	reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}

  exportToExcel(){
    this._laporanServiceProxy.exportAllLaporanKelulusanToExcel(
      this.filter ?? undefined,
      this.filterFromDateMula  ?? undefined,
      this.filterToDateMula ?? undefined,
      this.filterFromDateTamat  ?? undefined,
      this.filterToDateTamat ?? undefined,
    ).subscribe(e=>{
      this._fileDownloadService.downloadTempFile(e);
    })
  }

  resetFilter() {
    this.filter = undefined;
    this.filterFromDateMula = undefined;
    this.filterToDateMula = undefined;
    this.filterFromDateTamat = undefined;
    this.filterToDateTamat = undefined;
    this.filterString = undefined;
    this.fromDateMula = undefined;
    this.toDateMula = undefined;
    this.fromDateTamat = undefined;
    this.toDateTamat = undefined;
    this.chooseFromDateMula = false;
    this.chooseFromDateTamat = false;
    this.applyFilter(this.filterString);
    this.getKelulusanReport();
  }

  getTahun() {
    this.filterYear = this.filterTahun;
    this.filterPastYear = this.filterTahun - 1;
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

  pilihTarikhMula(){
    this.chooseFromDateMula = true;
    if(this.fromDateMula == null){
      this.chooseFromDateMula = false;
      this.toDateMula = null;
    }
  }

  pilihTarikhTamat(){
    this.chooseFromDateTamat = true;
    if(this.fromDateTamat == null){
      this.chooseFromDateTamat = false;
      this.toDateTamat = null;
    }
  }

  changeDateToString(){
    this.filterFromDateMula = this.toModel(this.fromDateMula);
    this.filterToDateMula = this.toModel(this.toDateMula);
  }

  changeDateToStringTamat(){
    this.filterFromDateTamat = this.toModel(this.fromDateTamat);
    this.filterToDateTamat = this.toModel(this.toDateTamat);
  }

}
