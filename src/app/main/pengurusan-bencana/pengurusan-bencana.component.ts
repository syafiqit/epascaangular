import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { TambahEditPengurusanBencanaComponent } from './tambah-edit-pengurusan-bencana/tambah-edit-pengurusan-bencana.component';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { 
	RefBencanaServiceProxy, 
	RefJenisBencanaServiceProxy, 
	RefNegeriServiceProxy 
} from 'src/app/shared/proxy/service-proxies';

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

  filter = '';
  sorting: string;
  skipCount: number;
  maxResultCount: number;
  disasters: any[];
  states: any[];

	constructor(
    config: NgbModalConfig, 
    private modalService: NgbModal,
    private _refBencanaServiceProxy: RefBencanaServiceProxy,
	private _refNegeriServiceProxy: RefNegeriServiceProxy,
	private _refJenisBencanaServiceProxy: RefJenisBencanaServiceProxy
  ) {
		this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
		this.negeri();
		this.bencana();
	}

	getApplication(event?: LazyLoadEvent) {
		if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this._refBencanaServiceProxy
			.getAll(
				this.filter,
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

	bencana() {
		this._refJenisBencanaServiceProxy
			.getAll(this.filter, this.sorting, this.skipCount, (this.maxResultCount = 20))
			.subscribe((result) => {
				this.disasters = result.items.map((data) => {
					return data.nama_jenis_bencana;
				});
			});
	}

	getBencana(id) {
		return this.disasters[id - 1];
	}

	negeri() {
		this._refNegeriServiceProxy
			.getAll(this.filter, this.sorting, this.skipCount, (this.maxResultCount = 20))
			.subscribe((result) => {
				this.states = result.items.map((data) => {
					return data.nama_negeri;
				});
			});
	}

	getNegeri(id) {
		return this.states[id - 1];
	}

	reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}

	addDisasterModal() {
		const modalRef = this.modalService.open(TambahEditPengurusanBencanaComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
		modalRef.result.then((response) => {
			if (response) {
				this.getApplication();
			}
		});
	}

	editDisasterModal(id) {
		const modalRef = this.modalService.open(TambahEditPengurusanBencanaComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'edit';
		modalRef.componentInstance.id = id;
		modalRef.result.then((response) => {
			if (response) {
				this.getApplication();
			}
		});
	}

}
