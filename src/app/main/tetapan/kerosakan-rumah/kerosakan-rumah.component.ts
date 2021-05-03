import { OnInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { TambahEditKerosakanRumahComponent } from './tambah-edit-kerosakan-rumah/tambah-edit-kerosakan-rumah.component';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { RefKerosakanServiceProxy } from '../../../shared/proxy/service-proxies';
import { finalize } from 'rxjs/operators';

@Component({
	selector: 'app-kerosakan-rumah',
	templateUrl: './kerosakan-rumah.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class KerosakanRumahComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

	filterText = '';
	filter: any;

	constructor(
		config: NgbModalConfig,
		private modalService: NgbModal,
		private _refKerosakanServiceProxy: RefKerosakanServiceProxy
	) {
		config.backdrop = 'static';
		config.keyboard = false;
		this.primengTableHelper = new PrimengTableHelper();
	}

	ngOnInit(): void {}

	getStatusKerosakan(event?: LazyLoadEvent) {
		if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this._refKerosakanServiceProxy
			.getAll(
				this.filterText,
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

	addDamageModal() {
		const modalRef = this.modalService.open(TambahEditKerosakanRumahComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
		modalRef.result.then((response) => {
			if (response) {
				this.getStatusKerosakan();
			}
		});
	}

	editDamageModal(id) {
		const modalRef = this.modalService.open(TambahEditKerosakanRumahComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'edit';
		modalRef.componentInstance.id = id;
		modalRef.result.then((response) => {
			if (response) {
				this.getStatusKerosakan();
			}
		});
	}
}
