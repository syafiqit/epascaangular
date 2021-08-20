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
  selector: 'app-laporan-baik-pulih-rumah',
  templateUrl: './laporan-baik-pulih-rumah.component.html',
  encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class LaporanBaikPulihRumahComponent implements OnInit {
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
      nama: 'Wahadi Bin Mohamed', no_kp: '910906043073', alamat_1: 'Taman Indah Permai', alamat_2: 'Jalan Hutan Kampung',
      nama_daerah: 'KEPALA BATAS', nama_negeri: 'KEDAH', pemilik: 'Wahadi Bin Mohamed', sumber_dana: 'Majlis Amanah Rakyat (MARA)',
      pelaksana: 'Johan Group Sdn Bhd', tarikh_mula: '12-02-2021', tarikh_siap: '25-05-2021', peratusan_kemajuan: '100', status_kemajuan: 'Siap Bina',
      kos_anggaran: '5000.00', kos_sebenar: '5000.00'
		},
		{
      nama: 'Burhanuddin Bin Borhan', no_kp: '890901077075', alamat_1: 'Taman Permata', alamat_2: 'Jalan Pegawai',
      nama_daerah: 'KOTA SETAR', nama_negeri: 'KEDAH', pemilik: 'Burhanuddin Bin Borhan', sumber_dana: 'Majlis Amanah Rakyat (MARA)',
      pelaksana: 'Johan Group Sdn Bhd', tarikh_mula: '12-05-2021', tarikh_siap: '-', peratusan_kemajuan: '60', status_kemajuan: 'Bina',
      kos_anggaran: '5000.00', kos_sebenar: '5000.00'
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

	getBaikPulihRumah(event?: LazyLoadEvent) {
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
