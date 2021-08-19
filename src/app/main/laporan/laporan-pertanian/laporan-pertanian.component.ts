import { OnInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbDateStruct, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import {
  RefBencanaServiceProxy,
  RefDaerahServiceProxy,
  RefJenisBencanaServiceProxy,
  RefNegeriServiceProxy
} from 'src/app/shared/proxy/service-proxies';

@Component({
	selector: 'app-laporan-pertanian',
	templateUrl: './laporan-pertanian.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class LaporanPertanianComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;
	public isCollapsed = false;
  categories: any;
  disasters: any;
  states: any;
  districts: any;
  filterIdNegeri: number;

  date = new Date();
  modelMula: NgbDateStruct;
  modelTamat: NgbDateStruct;
  readonly DELIMITER = '-';

	rows = [
		{
      nama: 'Wahadi Bin Mohamed', no_kp: '910906043073', alamat_1: 'Taman Indah Permai', alamat_2: 'Jalan Behor Pulai',
      nama_daerah: 'KANGAR', nama_negeri: 'PERLIS', pemberi_bantuan: 'Majlis Perbandaran Kangar', jenis_pertanian: 'Kelapa Sawit',
      keluasan_pertanian: '50', keluasan_musnah: '30', bilangan_asal: '50000', bilangan_musnah: '30000', nilai_kerosakan: '5000.00',
      nilai_bantuan: '5000.00', tarikh_bantuan: '12-03-2021', jumlah_bantuan: '5000.00', catatan: 'Bantuan Baja Pertanian'
		},
		{
      nama: 'Burhanuddin Bin Borhan', no_kp: '890901077075', alamat_1: 'Taman Permata', alamat_2: 'Jalan Pegawai',
      nama_daerah: 'KOTA SETAR', nama_negeri: 'KEDAH', pemberi_bantuan: 'Majlis Bandaraya Alor Setar', jenis_pertanian: 'Sawah Padi',
      keluasan_pertanian: '50', keluasan_musnah: '30', bilangan_asal: '50000', bilangan_musnah: '30000', nilai_kerosakan: '5000.00',
      nilai_bantuan: '5000.00', tarikh_bantuan: '12-03-2021', jumlah_bantuan: '5000.00', catatan: 'Bantuan Baja Pertanian'
		}
	];

	constructor(
    config: NgbModalConfig,
    private _refJenisBencanaServiceProxy: RefJenisBencanaServiceProxy,
    private _refBencanaServiceProxy: RefBencanaServiceProxy,
    private _refDaerahServiceProxy: RefDaerahServiceProxy,
    private _refNegeriServiceProxy: RefNegeriServiceProxy
  ) {
		this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
    this.getJenisBencana();
    this.getBencana();
    this.getDaerah();
    this.getNegeri();
  }

  toModel(date: NgbDateStruct | null): string | null {
    return date ? date.year + this.DELIMITER + date.month + this.DELIMITER + date.day : null;
  }

	getPertanianReport(event?: LazyLoadEvent) {
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

  getDaerah(filter?) {
		this._refDaerahServiceProxy.getRefDaerahForDropdown(filter, this.filterIdNegeri).subscribe((result) => {
			this.categories = result.items;
		});
	}

  getNegeri(filter?) {
		this._refNegeriServiceProxy.getRefNegeriForDropdown(filter).subscribe((result) => {
			this.states = result.items;
		});
	}

	reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}
}
