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
  selector: 'app-laporan-bwi-penerima-bantuan',
  templateUrl: './laporan-bwi-penerima-bantuan.component.html',
  encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class LaporanBwiPenerimaBantuanComponent implements OnInit {
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
      nama: 'Abu Bakar Bin Ahmad', no_kp: '860124097898', alamat_1: 'Lot 078-1', alamat_2: 'Pantai Kelanang',
      nama_daerah: 'MARANG', nama_negeri: 'TERENGGANU', tarikh_serahan: '12-02-2021', jumlah: '7310.00'
		},
		{
      nama: 'Nur Suhaila Binti Syamsul Kamal', no_kp: '910906043073', alamat_1: 'Blok 31', alamat_2: 'Kampung Permatang',
      nama_daerah: 'MUAR', nama_negeri: 'JOHOR', tarikh_serahan: '12-02-2021', jumlah: '3198.00'
		},
    {
      nama: 'Mohd. Azri Bin Razali', no_kp: '980106109090', alamat_1: 'Taman Indah Permai', alamat_2: 'Jalan Hutan Kampung',
      nama_daerah: 'KEPALA BATAS', nama_negeri: 'KEDAH', tarikh_serahan: '12-02-2021', jumlah: '5000.00'
		},
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

	getPenerimaBwi(event?: LazyLoadEvent) {
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
