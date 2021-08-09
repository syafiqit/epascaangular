import { OnInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbDateStruct, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { TabungServiceProxy } from 'src/app/shared/proxy/service-proxies';

@Component({
	selector: 'app-laporan-bayaran-terus',
	templateUrl: './laporan-bayaran-terus.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class LaporanBayaranTerusComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;
	public isCollapsed = false;
  funds: any;

  date = new Date();
  modelMula: NgbDateStruct;
  modelTamat: NgbDateStruct;
  readonly DELIMITER = '-';

	rows = [
		{
      no_bayaran: 'BTK-2101-00001', no_kelulusan: 'KEL-2101-00001', no_baucer: 'BT-00001', tarikh_bayaran: '31-01-2021',
      perihal: 'Bayaran Latihan Separa Pakej Program', kepada: 'Qiffarah Ventures Sdn Bhd', kategori_tabung: 'KWABBN',
      jumlah_belanja: '49000.00'
		},
		{
      no_bayaran: 'BTK-2101-00003', no_kelulusan: 'KEL-2101-00002', no_baucer: 'BT-00011', tarikh_bayaran: '31-03-2021',
      perihal: 'Perolehan Darurat Bencana', kepada: 'Perintis Sanubari Sdn Bhd', kategori_tabung: 'Covid',
      jumlah_belanja: '326000.00'
		}
	];

	constructor(
    config: NgbModalConfig,
    private _tabungServiceProxy: TabungServiceProxy
  ) {
		this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
    this.getTabung();
  }

  toModel(date: NgbDateStruct | null): string | null {
    return date ? date.year + this.DELIMITER + date.month + this.DELIMITER + date.day : null;
  }

	getTerusReport(event?: LazyLoadEvent) {
		if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this.primengTableHelper.totalRecordsCount = this.rows.length;
		this.primengTableHelper.records = this.rows;
		this.primengTableHelper.hideLoadingIndicator();
	}

  getTabung(filter?) {
		this._tabungServiceProxy.getTabungForDropdown(filter).subscribe((result) => {
			this.funds = result.items;
		});
	}

	reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}
}
