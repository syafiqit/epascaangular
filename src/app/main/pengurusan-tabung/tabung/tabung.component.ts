import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { TambahEditTabungComponent } from './tambah-edit-tabung/tambah-edit-tabung.component';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { TabungServiceProxy } from 'src/app/shared/proxy/service-proxies';
import { finalize } from 'rxjs/operators';

@Component({
	selector: 'app-tabung',
	templateUrl: './tabung.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TabungComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;
  filterText: string;

	rows = [
		{
			name: 'KWABBN',
			date: '1/01/2020',
			total: '235,882,775.21',
			date2: '31/12/2020',
			total2: '255,199,152.00',
			total_overal: '491,081,927,21',
			balance: '282,925,285.85',
			balance_until: '282,925,285.85'
		},
		{
			name: 'Covid-19',
			date: '1/01/2020',
			total: '235,882,775.21',
			date2: '31/12/2020',
			total2: '255,199,152.00',
			total_overal: '491,081,927,21',
			balance: '282,925,285.85',
			balance_until: '282,925,285.85'
		}
	];

	report = [
		{ title: 'Jumlah Keseluruhan Semasa (RM)', total_kos: '491,081,927.21' },
		{ title: 'Jumlah Bayaran Semasa (RM)', total_kos: '312,123,121.00' },
		{ title: 'Jumlah Tanggung Semasa (RM)', total_kos: '22,323,321.00' }
	];

	constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private tabungServiceProxy: TabungServiceProxy
    ) {
		this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {}

	getTabung(event?: LazyLoadEvent) {
    if (this.primengTableHelper.shouldResetPaging(event)) {
      this.paginator.changePage(0);
      return;
    }
    this.primengTableHelper.showLoadingIndicator();

    this.tabungServiceProxy
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

	addFundModal() {
		const modalRef = this.modalService.open(TambahEditTabungComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
	}
}
