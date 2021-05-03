import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { TambahEditAgensiComponent } from './tambah-edit-agensi/tambah-edit-agensi.component';
import { RefAgensiServiceProxy, RefKementerianServiceProxy } from 'src/app/shared/proxy/service-proxies';
import { finalize } from 'rxjs/operators';

@Component({
	selector: 'app-agensi',
	templateUrl: './agensi.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class AgensiComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

	filter = '';
	sorting: string;
	skipCount: number;
	maxResultCount: number;
	ministry: any[];

	constructor(
		config: NgbModalConfig,
		private modalService: NgbModal,
		private _refAgensiServiceProxy: RefAgensiServiceProxy,
		private _refKementerianServiceProxy: RefKementerianServiceProxy
	) {
		this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
		this.kementerian();
	}

	getAgensi(event?: LazyLoadEvent) {
		if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this._refAgensiServiceProxy
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

	kementerian() {
		this._refKementerianServiceProxy
			.getAll(this.filter, this.sorting, this.skipCount, (this.maxResultCount = 20))
			.subscribe((result) => {
				this.ministry = result.items.map((data) => {
					return data.nama_kementerian;
				});
			});
	}

	getKementerian(id) {
		return this.ministry[id - 1];
	}

	reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}

	addAgencyModal() {
		const modalRef = this.modalService.open(TambahEditAgensiComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
		modalRef.result.then((response) => {
			if (response) {
				this.getAgensi();
			}
		});
	}

	editAgencyModal(id) {
		const modalRef = this.modalService.open(TambahEditAgensiComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'edit';
		modalRef.componentInstance.id = id;
		modalRef.result.then((response) => {
			if (response) {
				this.getAgensi();
			}
		});
	}
}
