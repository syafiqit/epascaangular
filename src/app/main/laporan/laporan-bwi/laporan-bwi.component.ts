import { OnInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { RefDaerahServiceProxy, RefJenisBencanaServiceProxy, RefNegeriServiceProxy } from 'src/app/shared/proxy/service-proxies';

@Component({
	selector: 'app-laporan-bwi',
	templateUrl: './laporan-bwi.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class LaporanBwiComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;
	public isCollapsed = false;
  states: any;
  districts: any;
  disasters: any;
  filterIdNegeri: number;

	rows = [
		{
      nama_negeri: 'JOHOR', nama_daerah: 'MUAR', jenis_bencana: 'Banjir', bwi_kir: '500.00', jumlah_kir: '76',
      jumlah_bantuan: '38000.00', perakuan_kp: 'RP021004 23-03-2021', penyaluran_bkp: 'RS021004 23-03-2021',
      tarikh_majlis: '31-05-2021', makluman_majlis: 'RM021004 23-03-2021', tarikh_eft: '23-03-2021',
      baki_pulangan: '2000.00', laporan_majlis: '-', laporan_bkp: 'RL021004 23-03-2021', catatan: '-'
		},
		{
      nama_negeri: 'KELANTAN', nama_daerah: 'KOTA BHARU', jenis_bencana: 'Banjir', bwi_kir: '1000.00', jumlah_kir: '50',
      jumlah_bantuan: '50000.00', perakuan_kp: 'RP021024 23-05-2021', penyaluran_bkp: 'RS021024 23-05-2021',
      tarikh_majlis: '16-07-2021', makluman_majlis: 'RM021024 23-05-2021', tarikh_eft: '23-05-2021',
      baki_pulangan: '5000.00', laporan_majlis: '-', laporan_bkp: 'RL021024 23-05-2021', catatan: '-'
		}
	];

	constructor(
    config: NgbModalConfig,
    private _refNegeriServiceProxy: RefNegeriServiceProxy,
    private _refDaerahServiceProxy: RefDaerahServiceProxy,
    private _refJenisBencanaServiceProxy: RefJenisBencanaServiceProxy
  ) {
		this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
    this.getNegeri();
    this.getDaerah();
    this.getBencana();
  }

	getBwiReport(event?: LazyLoadEvent) {
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

  getBencana(filter?) {
		this._refJenisBencanaServiceProxy.getRefJenisBencanaForDropdown(filter).subscribe((result) => {
			this.disasters = result.items;
		});
	}

	reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}
}
