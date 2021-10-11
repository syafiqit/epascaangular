import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { TambahEditTabungComponent } from './tambah-edit-tabung/tambah-edit-tabung.component';
import { NgbDateStruct, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { TabungServiceProxy } from 'src/app/shared/proxy/service-proxies';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AppSessionService } from '@app/shared/services/app-session.service';

@Component({
	selector: 'app-tabung',
	templateUrl: './tabung.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TabungComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;
  filterText: string;
  filterMonth: string;
  filterFromDate: string;
  filterToDate: string;
  terms$ = new Subject<string>();
  tarikhMula: NgbDateStruct;
  tarikhTamat: NgbDateStruct;
  readonly DELIMITER = '-';

  public isCollapsed = false;
  jumlah_keseluruhan: number;
  jumlah_perbelanjaan_semasa: number;
  jumlah_tanggungan: number;

	constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private tabungServiceProxy: TabungServiceProxy,
    public _appSession: AppSessionService
    ) {
		this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
    this.getTotalCard();


    this.terms$.pipe(
      debounceTime(500), distinctUntilChanged()
    ).subscribe((filterValue: string) =>{
      this.filterText = filterValue;
      this.getTabung();
    });
  }

  applyFilter(filterValue: string){
    this.terms$.next(filterValue);
  }

  getTotalCard(){
    this.tabungServiceProxy.getTotalTabungCard(this.filterMonth).subscribe((result) => {
      this.jumlah_keseluruhan = result.jumlah_keseluruhan;
      this.jumlah_perbelanjaan_semasa = result.jumlah_perbelanjaan_semasa;
      this.jumlah_tanggungan = result.jumlah_tanggungan;
    });
  }

	getTabung(event?: LazyLoadEvent) {
    if(this.tarikhMula){
      this.filterFromDate = this.toModel(this.tarikhMula);
    }

    if(this.tarikhTamat){
      this.filterToDate = this.toModel(this.tarikhTamat);
    }

		if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this.tabungServiceProxy
			.getAll(
				this.filterText,
        this.filterFromDate ?? undefined,
        this.filterToDate ?? undefined,
				this.primengTableHelper.getSorting(this.dataTable),
				this.primengTableHelper.getSkipCount(this.paginator, event),
				this.primengTableHelper.getMaxResultCount(this.paginator, event)
			)
      .pipe(
				finalize(() => {
					this.primengTableHelper.hideLoadingIndicator();
				})
			)
			.subscribe((result) => {
				this.primengTableHelper.totalRecordsCount = result.total_count;
				this.primengTableHelper.records = result.items;
			});
	}

	reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}

  toModel(date: NgbDateStruct | null): string | null {
    return date ? date.year + this.DELIMITER + date.month + this.DELIMITER + date.day : null;
  }

  resetFilter() {
    this.filterText = undefined;
    this.tarikhMula = undefined;
    this.tarikhTamat = undefined;
    this.filterFromDate = undefined;
    this.filterToDate = undefined;

    this.getTabung();
  }

	addFundModal() {
		const modalRef = this.modalService.open(TambahEditTabungComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
    modalRef.result.then((response) => {
			if (response) {
				this.getTabung();
        this.getTotalCard();
			}
		});
	}
}
