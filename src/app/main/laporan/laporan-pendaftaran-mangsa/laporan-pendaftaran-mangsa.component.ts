import { OnInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbDateStruct, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import {
  RefAgensiServiceProxy,
  RefBencanaServiceProxy,
  RefDaerahServiceProxy,
  RefJenisBencanaServiceProxy,
  RefKementerianServiceProxy,
  RefNegeriServiceProxy
} from 'src/app/shared/proxy/service-proxies';

@Component({
  selector: 'app-laporan-pendaftaran-mangsa',
  templateUrl: './laporan-pendaftaran-mangsa.component.html'
})
export class LaporanPendaftaranMangsaComponent implements OnInit {

  @ViewChild('dataTable', { static: true }) dataTable: Table;
  @ViewChild('paginator', { static: true }) paginator: Paginator;

  primengTableHelper: PrimengTableHelper;
  public isCollapsed = false;
  categories: any;
  disasters: any;
  agensi: any;
  districts: any;
  filterIdNegeri: number;

  date = new Date();
  modelMula: NgbDateStruct;
  modelTamat: NgbDateStruct;
  readonly DELIMITER = '-';

	rows = [
		{
      no_kp: '910906043073', nama_kir: 'Wahadi Bin Mohamed', kementerian: 'Kementerian Pembangunan',
      agensi: 'NADMA', tarikh_pendaftaran: '21/02/2021'
		},
		{
      no_kp: '890901077075', nama_kir: 'Burhanuddin Bin Borhan', kementerian: 'Kementerian Hasil Bumi',
      agensi: 'NADMA', tarikh_pendaftaran: '21/03/2021'
		}
	];

	constructor(
    config: NgbModalConfig,
    private _refJenisBencanaServiceProxy: RefJenisBencanaServiceProxy,
    private _refBencanaServiceProxy: RefBencanaServiceProxy,
    private _refKementerianServiceProxy: RefKementerianServiceProxy,
    private _refAgensiServiceProxy: RefAgensiServiceProxy
  ) {
		this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
    this.getJenisBencana();
    this.getBencana();
    this.getKementerian();
    this.getAgensi();
  }

  toModel(date: NgbDateStruct | null): string | null {
    return date ? date.year + this.DELIMITER + date.month + this.DELIMITER + date.day : null;
  }

	getBelumTerimaBantuan(event?: LazyLoadEvent) {
		if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this.primengTableHelper.totalRecordsCount = this.rows.length;
		this.primengTableHelper.records = this.rows;
		this.primengTableHelper.hideLoadingIndicator();
	}

  getJenisBencana(filter?) {
		this._refJenisBencanaServiceProxy.getRefJenisBencanaForDropdown(filter).subscribe((result) => {
			this.categories = result.items;
		});
	}

  getBencana(filter?) {
		this._refBencanaServiceProxy.getRefBencanaForDropdown(filter).subscribe((result) => {
			this.disasters = result.items;
		});
	}

  getKementerian(filter?) {
		this._refKementerianServiceProxy.getRefKementerianForDropdown(filter).subscribe((result) => {
			this.categories = result.items;
		});
	}

  getAgensi(filter?) {
		this._refAgensiServiceProxy.getRefAgensiForDropdown(filter).subscribe((result) => {
			this.agensi = result.items;
		});
	}

	reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}

}
