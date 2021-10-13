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
  terms$ = new Subject<string>();

	rows = [
		{
			jenis_bantuan: 'BWI',
			jumlah_kadar: '500',
			status: 'Aktif'
		},
    {
			jenis_bantuan: 'BWI',
			jumlah_kadar: '200',
			status: 'Aktif'
		},
		{
			jenis_bantuan: 'Kematian',
			jumlah_kadar: '5000',
			status: 'Aktif'
		}
	];

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
		if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this._refKadarBwiServiceProxy
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
