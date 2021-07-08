import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { TambahEditPengurusanBencanaComponent } from './tambah-edit-pengurusan-bencana/tambah-edit-pengurusan-bencana.component';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import {
	RefBencanaServiceProxy,
	RefJenisBencanaServiceProxy
} from 'src/app/shared/proxy/service-proxies';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-pengurusan-bencana',
  templateUrl: './pengurusan-bencana.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})

export class PengurusanBencanaComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;
	public isCollapsed = false;

  filter: string;
  filterTahun: number;
  filterBencana: string;
  filterJenis: number;
  terms$ = new Subject<string>();

  sorting: string;
  skipCount: number;
  maxResultCount: number;
  disasters: any[];
  states: any[];

	constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private _refBencanaServiceProxy: RefBencanaServiceProxy,
    private _refJenisBencanaServiceProxy: RefJenisBencanaServiceProxy
  ) {
		this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
		this.getJenisBencana();

    this.terms$.pipe(
      debounceTime(500), distinctUntilChanged()
    ).subscribe((filterValue: string) =>{
      this.filter = filterValue;
      this.getDisaster();
    });

	}

  applyFilter(filterValue: string){
    this.terms$.next(filterValue);
  }

	getDisaster(event?: LazyLoadEvent) {
    if(this.filterTahun == null){
      this.filterTahun = undefined;
    }

    if(this.filterBencana == null){
      this.filterBencana = undefined;
    }

    if(this.filterJenis == null){
      this.filterJenis = undefined;
    }

		if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this._refBencanaServiceProxy
			.getAll(
				this.filter,
        this.filterTahun,
        this.filterBencana,
        this.filterJenis,
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

  getJenisBencana(filter?) {
		this._refJenisBencanaServiceProxy.getRefJenisBencanaForDropdown(filter).subscribe((result) => {
			this.disasters = result.items;
		});
	}

  resetFilter() {
    this.filter = undefined;
    this.filterJenis = undefined;

    this.getDisaster();
  }

	reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}

	addDisasterModal() {
		const modalRef = this.modalService.open(TambahEditPengurusanBencanaComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
		modalRef.result.then((response) => {
			if (response) {
				this.getDisaster();
			}
		});
	}

	editDisasterModal(id) {
		const modalRef = this.modalService.open(TambahEditPengurusanBencanaComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'edit';
		modalRef.componentInstance.id = id;
		modalRef.result.then((response) => {
			if (response) {
				this.getDisaster();
			}
		});
	}

}
