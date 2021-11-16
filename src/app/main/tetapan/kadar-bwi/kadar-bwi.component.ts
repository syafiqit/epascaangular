import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { TambahEditKadarBwiComponent } from './tambah-edit-kadar-bwi/tambah-edit-kadar-bwi.component';
import { RefKadarBwiServiceProxy } from '@app/shared/proxy/service-proxies';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';

@Component({
	selector: 'app-kadar-bwi',
	templateUrl: './kadar-bwi.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal, RefKadarBwiServiceProxy]
})
export class KadarBwiComponent {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

	filter: string;
  filterStatus: number;
  filterString: string;
  public isCollapsed = false;
  terms$ = new Subject<string>();

  status=[
    {id: 1, nama_status: 'Aktif'},
    {id: 2, nama_status: 'Tidak Aktif'}
  ]

	constructor(
		config: NgbModalConfig,
		private modalService: NgbModal,
		private _refKadarBwiServiceProxy: RefKadarBwiServiceProxy) {
		this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
		this.terms$.pipe(
		  debounceTime(500), distinctUntilChanged()
		).subscribe((filterValue: string) =>{
		  this.filter = filterValue;
		  this.getKadarBwi();
		});
	  }

	getKadarBwi(event?: LazyLoadEvent) {
		this.primengTableHelper.showLoadingIndicator();
		this._refKadarBwiServiceProxy
			.getAll(
				this.filter,
        this.filterStatus ?? undefined,
				this.primengTableHelper.getSorting(this.dataTable),
				this.primengTableHelper.getSkipCount(this.paginator, event),
				this.primengTableHelper.getMaxResultCount(this.paginator, event)
			)
      .pipe(finalize(()=>{
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

  resetFilter() {
    this.filter = undefined;
    this.filterStatus = undefined;
    this.filterString = undefined;
    this.applyFilter(this.filterString);
    this.getKadarBwi();
  }

	applyFilter(filterValue: string){
		this.terms$.next(filterValue);
	  }

	addKadarBwiModal() {
		const modalRef = this.modalService.open(TambahEditKadarBwiComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
		modalRef.result.then((response) => {
			if (response) {
				this.getKadarBwi();
			}
		});
	}

	editKadarBwiModal(id) {
		const modalRef = this.modalService.open(TambahEditKadarBwiComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'edit';
		modalRef.componentInstance.id = id;
		modalRef.result.then((response) => {
			if (response) {
				this.getKadarBwi();
			}
		});
	}
}
