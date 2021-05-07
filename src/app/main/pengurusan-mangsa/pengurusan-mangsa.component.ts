import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { LazyLoadEvent } from 'primeng/api';
import { MangsaServiceProxy } from 'src/app/shared/proxy/service-proxies';
import { finalize } from 'rxjs/operators';
import { NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
declare let require;
const Swal = require('sweetalert2');

@Component({
	selector: 'app-pengurusan-mangsa',
	templateUrl: './pengurusan-mangsa.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class PengurusanMangsaComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

	filter: string;

	public isCollapsed = false;

	categories = [{ data: 'barangan kebersihan' }, { data: 'barangan perubatan' }];

	items = [{ data: 'Nama' }, { data: 'No KP' }];

	constructor(
		config: NgbModalConfig,
    private _mangsaServiceProxy: MangsaServiceProxy
  ) {
		this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {}

	getVictim(event?: LazyLoadEvent) {
		if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this._mangsaServiceProxy
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

	delete() {
		Swal.fire('Berjaya!', 'Barangan Berjaya Di Buang.', 'success');
	}
}
