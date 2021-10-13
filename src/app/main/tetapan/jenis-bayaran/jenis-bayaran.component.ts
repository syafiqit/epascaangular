import { Component, OnInit, ViewChild } from '@angular/core';
import { PrimengTableHelper } from '@app/shared/helpers/PrimengTableHelper';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { TambahEditJenisBayaranComponent } from './tambah-edit-jenis-bayaran/tambah-edit-jenis-bayaran.component';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { RefJenisBayaranServiceProxy } from '@app/shared/proxy/service-proxies';

@Component({
  selector: 'app-jenis-bayaran',
  templateUrl: './jenis-bayaran.component.html'
})
export class JenisBayaranComponent implements OnInit {
  @ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;
  disasters: any;

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
		private _refJenisBayaranServiceProxy: RefJenisBayaranServiceProxy
  ) {
    this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
  }

  ngOnInit(): void {
    this.terms$.pipe(
      debounceTime(500), distinctUntilChanged()
    ).subscribe((filterValue: string) =>{
      this.filter = filterValue;
      this.getJenisBayaran();
    });
  }

  applyFilter(filterValue: string){
    this.terms$.next(filterValue);
  }

  getJenisBayaran(event?: LazyLoadEvent) {
	if (this.primengTableHelper.shouldResetPaging(event)) {
		this.paginator.changePage(0);
		return;
	}

	this.primengTableHelper.showLoadingIndicator();
	this._refJenisBayaranServiceProxy
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

    this.getJenisBayaran();
  }

	addJenisBayaranModal() {
		const modalRef = this.modalService.open(TambahEditJenisBayaranComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
		modalRef.result.then((response) => {
			if (response) {
				this.getJenisBayaran();
			}
		});
	}

	editJenisBayaranModal(id) {
		const modalRef = this.modalService.open(TambahEditJenisBayaranComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'edit';
		modalRef.componentInstance.id = id;
		modalRef.result.then((response) => {
			if (response) {
				this.getJenisBayaran();
			}
		});
	}
}
