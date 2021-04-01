import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { TambahEditDaerahComponent } from './tambah-edit-daerah/tambah-edit-daerah.component';
import { RefDaerahServiceProxy, RefNegeriServiceProxy } from '../../../shared/proxy/service-proxies';

@Component({
	selector: 'app-daerah',
	templateUrl: './daerah.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class DaerahComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

	filterText = '';
	filter: any;
	sorting: any;
	skipCount: any;
	maxResultCount: any;
	states: any[];

	constructor(
		config: NgbModalConfig,
		private modalService: NgbModal,
		private _refDaerahServiceProxy: RefDaerahServiceProxy,
		private _refNegeriServiceProxy: RefNegeriServiceProxy
	) {
		this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
		this.negeri();
	}

	getDaerah(event?: LazyLoadEvent) {
		if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this._refDaerahServiceProxy
			.getAll(
				this.filterText,
				this.primengTableHelper.getSorting(this.dataTable),
				this.primengTableHelper.getSkipCount(this.paginator, event),
				this.primengTableHelper.getMaxResultCount(this.paginator, event)
			)
			.subscribe((result) => {
				this.primengTableHelper.totalRecordsCount = result.total_count;
				this.primengTableHelper.records = result.items;
				this.primengTableHelper.hideLoadingIndicator();
			});
	}

	reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}

	negeri() {
		this._refNegeriServiceProxy.getRefNegeriForDropdown(this.filter).subscribe((result) => {
			this.states = result.items.map((data) => {
				return data.nama_negeri;
			});
		});
	}

	getNegeri(id) {
		return this.states[id - 1];
	}

	addDistrictModal() {
		const modalRef = this.modalService.open(TambahEditDaerahComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
		modalRef.result.then((response) => {
			if (response) {
				this.getDaerah();
			}
		});
	}

	editDistrictModal(id) {
		const modalRef = this.modalService.open(TambahEditDaerahComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'edit';
		modalRef.componentInstance.id = id;
		modalRef.result.then((response) => {
			if (response) {
				this.getDaerah();
			}
		});
	}
}
