import { OnInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbDateStruct, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { TabungServiceProxy } from 'src/app/shared/proxy/service-proxies';

@Component({
	selector: 'app-laporan-skb-bulan',
	templateUrl: './laporan-skb-bulan.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class LaporanSkbBulanComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;
	public isCollapsed = false;
  funds: any;

  date = new Date();
  modelMula: NgbDateStruct;
  modelTamat: NgbDateStruct;
  readonly DELIMITER = '-';

  statusSKB = [
    { id: 1, status: 'Aktif' }, { id: 2, status: 'Lanjut' },
    { id: 3, status: 'Selesai' }, { id: 4, status: 'Tamat Tempoh' }
  ];

	rows = [
		{
      no_rujukan_skb: 'SKB-2101-00001', no_kelulusan: 'KEL-2101-00001', tarikh_mula: '01-01-2021', tarikh_tamat: '31-12-2021',
      status: 'Aktif', perihal: 'Perbelanjaan Dalaman', nama_pegawai: 'Wahadi Bin Mohamed', nama_agensi: 'Agensi Pengurusan Bencana Negara (NADMA)',
      siling_peruntukan: '15000.00', baki_peruntukan: '5000.00', kategori_tabung: 'KWABBN', bulan: 'JANUARI', jumlah_belanja: '10000.00'
		},
		{
      no_rujukan_skb: 'SKB-2101-00002', no_kelulusan: 'KEL-2101-00002', tarikh_mula: '01-01-2021', tarikh_tamat: '31-12-2021',
      status: 'Aktif', perihal: 'Perbelanjaan Operasi Bencana', nama_pegawai: 'Burhanuddin Bin Ramdhan', nama_agensi: 'APM Negeri Johor',
      siling_peruntukan: '75000.00', baki_peruntukan: '54000.00', kategori_tabung: 'Covid-19', bulan: 'FEBRUARI', jumlah_belanja: '21000.00'
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

	getSkbBulanReport(event?: LazyLoadEvent) {
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
