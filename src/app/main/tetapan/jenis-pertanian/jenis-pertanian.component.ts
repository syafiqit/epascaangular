import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';
import { TambahEditJenisPertanianComponent } from './tambah-edit-jenis-pertanian/tambah-edit-jenis-pertanian.component';
import { RefJenisPertanianServiceProxy } from '@shared/proxy/service-proxies';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
@Component({
	selector: 'app-jenis-pertanian',
	templateUrl: './jenis-pertanian.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class JenisPertanianComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

	filter: string;
  filterStatus: number;
  public isCollapsed = false;
  terms$ = new Subject<string>();

  status=[
    {id: 1, nama_status: 'Aktif'},
    {id: 2, nama_status: 'Tidak Aktif'}
  ]

	constructor(
		config: NgbModalConfig,
		private modalService: NgbModal,
		private _refJenisPertanianServiceProxy: RefJenisPertanianServiceProxy) {
		this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
		this.terms$.pipe(
		  debounceTime(500), distinctUntilChanged()
		).subscribe((filterValue: string) =>{
		  this.filter = filterValue;
		  this.getJenisPertanian();
		});
	  }

	  getJenisPertanian(event?: LazyLoadEvent) {
		this.primengTableHelper.showLoadingIndicator();
		this._refJenisPertanianServiceProxy
			.getAll(
				this.filter,
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

    this.getJenisPertanian();
  }

	applyFilter(filterValue: string){
		this.terms$.next(filterValue);
	  }

	addKadarBwiModal() {
		const modalRef = this.modalService.open(TambahEditJenisPertanianComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
		modalRef.result.then((response) => {
			if (response) {
				this.getJenisPertanian();
			}
		});
	}

	editKadarBwiModal(id) {
		const modalRef = this.modalService.open(TambahEditJenisPertanianComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'edit';
		modalRef.componentInstance.id = id;
		modalRef.result.then((response) => {
			if (response) {
				this.getJenisPertanian();
			}
		});
	}
}
