import { OnInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { RefDaerahServiceProxy, RefNegeriServiceProxy } from 'src/app/shared/proxy/service-proxies';

@Component({
	selector: 'app-laporan-bwi-kematian',
	templateUrl: './laporan-bwi-kematian.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class LaporanBwiKematianComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;
	public isCollapsed = false;
  states: any;
  districts: any;
  filterIdNegeri: number;

	rows = [
		{
      nama_negeri: 'JOHOR', nama_daerah: 'MUAR', butiran: '-', tarikh_memo_bkp: '13-02-2021', jumlah_kir: '76',
      bwi_kir: '500.00', jumlah_peruntukan: '38000.00', tarikh_eft: '31-03-2021', catatan: '-'
		},
		{
      nama_negeri: 'KELANTAN', nama_daerah: 'KOTA BHARU', butiran: '-', tarikh_memo_bkp: '13-01-2021', jumlah_kir: '50',
      bwi_kir: '1000.00', jumlah_peruntukan: '50000.00', tarikh_eft: '28-02-2021', catatan: '-'
		}
	];

	constructor(
    config: NgbModalConfig,
    private _refNegeriServiceProxy: RefNegeriServiceProxy,
    private _refDaerahServiceProxy: RefDaerahServiceProxy
  ) {
		this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
    this.getNegeri();
    this.getDaerah();
  }

	getBwiKematianReport(event?: LazyLoadEvent) {
		if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this.primengTableHelper.totalRecordsCount = this.rows.length;
		this.primengTableHelper.records = this.rows;
		this.primengTableHelper.hideLoadingIndicator();
	}

  getNegeri(filter?) {
		this._refNegeriServiceProxy.getRefNegeriForDropdown(filter).subscribe((result) => {
			this.states = result.items;
		});
	}

  getDaerah(filter?) {
		this._refDaerahServiceProxy.getRefDaerahForDropdown(filter, this.filterIdNegeri).subscribe((result) => {
			this.districts = result.items;
		});
	}

	reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}
}
