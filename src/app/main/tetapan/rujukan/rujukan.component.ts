import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { TambahEditRujukanComponent } from './tambah-edit-rujukan/tambah-edit-rujukan.component';
import {RefRujukanServiceProxy} from "../../../shared/proxy/service-proxies";
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
	selector: 'app-rujukan',
	templateUrl: './rujukan.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal, RefRujukanServiceProxy]
})
export class RujukanComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

  filterText: string;
  filterStatus: number;
  terms$ = new Subject<string>();

	constructor(
	  config: NgbModalConfig,
    private modalService: NgbModal,
    private _refRujukanServiceProxy: RefRujukanServiceProxy
  ) {
		this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
    this.terms$.pipe(
      debounceTime(500), distinctUntilChanged()
    ).subscribe((filterValue: string) =>{
      this.filterText = filterValue;
      this.getRujukan();
    });
  }

  applyFilter(filterValue: string){
    this.terms$.next(filterValue);
  }

	getRujukan(event?: LazyLoadEvent) {
    if (this.primengTableHelper.shouldResetPaging(event)) {
      this.paginator.changePage(0);
      return;
    }

    this.primengTableHelper.showLoadingIndicator();
    this._refRujukanServiceProxy
      .getAll(
        this.filterText,
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

	addReferenceModal() {
		const modalRef = this.modalService.open(TambahEditRujukanComponent, { size: 'lg' });
    modalRef.componentInstance.name = 'add';
    modalRef.result.then((response) => {
      if (response) {
        this.getRujukan();
      }
    });
	}

	editReferenceModal(id) {
		const modalRef = this.modalService.open(TambahEditRujukanComponent, { size: 'lg' });
    modalRef.componentInstance.name = 'edit';
    modalRef.componentInstance.id = id;
    modalRef.result.then((response) => {
      if (response) {
        this.getRujukan();
      }
    });
	}
}
