import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { TambahEditKementerianComponent } from './tambah-edit-kementerian/tambah-edit-kementerian.component';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { RefKementerianServiceProxy } from 'src/app/shared/proxy/service-proxies';
import { finalize } from 'rxjs/operators';

@Component({
	selector: 'app-kementerian',
	templateUrl: './kementerian.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class KementerianComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

	filter = '';

	constructor(
		config: NgbModalConfig,
		private modalService: NgbModal,
		private _refKementerianServiceProxy: RefKementerianServiceProxy
	) {
		this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {}

	getMinistry(event?: LazyLoadEvent) {
		if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this._refKementerianServiceProxy
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

	addMinistryModal() {
		const modalRef = this.modalService.open(TambahEditKementerianComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
		modalRef.result.then((response) => {
			if (response) {
				this.getMinistry();
			}
		});
	}

	editMinistryModal(id) {
		const modalRef = this.modalService.open(TambahEditKementerianComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'edit';
		modalRef.componentInstance.id = id;
		modalRef.result.then((response) => {
			if (response) {
				this.getMinistry();
			}
		});
	}
}
