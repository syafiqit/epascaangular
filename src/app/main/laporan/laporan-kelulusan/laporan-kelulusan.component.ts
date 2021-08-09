import { OnInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbDateStruct, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';

@Component({
	selector: 'app-laporan-kelulusan',
	templateUrl: './laporan-kelulusan.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class LaporanKelulusanComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;
	public isCollapsed = false;

  date = new Date();
  modelMula: NgbDateStruct;
  modelTamat: NgbDateStruct;
  readonly DELIMITER = '-';

	rows = [
		{
      no_kelulusan: 'KEL-2108-0001', tarikh_surat: '10-01-2021', rujukan_surat: 'JPM.APBN(S).600-3/8/2 (1)',
			tarikh_mula: '24-02-2021', tarikh_tamat: '-', siling_peruntukan: '200000.00', peruntukan_diambil: '150000.00',
      perihal_surat: 'Kelulusan Permohonan Tambahan Baik Pulih Rumah', belanja_covid: '23000.00', belanja_bukan_covid: '15000.00',
      skb_covid: '13000.00', skb_bukan_covid: '33000.00', belanja_semasa: '84000.00', jumlah_belanja: '150000.00',
      baki_peruntukan: '50000.00', rujukan: 'Permohonan Tambahan Kelulusan'
		},
		{
      no_kelulusan: 'KEL-2108-0002', tarikh_surat: '15-01-2021', rujukan_surat: 'JPM.APBN(S).600-3/8/2 (1)',
			tarikh_mula: '31-03-2021', tarikh_tamat: '-', siling_peruntukan: '330000.00', peruntukan_diambil: '330000.00',
      perihal_surat: 'Kelulusan Pembelian Vaksin', belanja_covid: '23000.00', belanja_bukan_covid: '15000.00',
      skb_covid: '18000.00', skb_bukan_covid: '83000.00', belanja_semasa: '184000.00', jumlah_belanja: '120000.00',
      baki_peruntukan: '80000.00', rujukan: 'Permohonan Kelulusan Tabung'
		}
	];

	constructor(
    config: NgbModalConfig
  ) {
		this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {}

  toModel(date: NgbDateStruct | null): string | null {
    return date ? date.year + this.DELIMITER + date.month + this.DELIMITER + date.day : null;
  }

	getKelulusanReport(event?: LazyLoadEvent) {
		if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this.primengTableHelper.totalRecordsCount = this.rows.length;
		this.primengTableHelper.records = this.rows;
		this.primengTableHelper.hideLoadingIndicator();
	}

	reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}
}
