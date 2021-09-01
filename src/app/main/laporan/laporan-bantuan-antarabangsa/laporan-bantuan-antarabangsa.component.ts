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
  selector: 'app-laporan-bantuan-antarabangsa',
  templateUrl: './laporan-bantuan-antarabangsa.component.html'
})
export class LaporanBantuanAntarabangsaComponent implements OnInit {

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
      no_kp: '910906043073', nama_kir: 'Wahadi Bin Mohamed', alamat: 'Residensi Mawar',
      daerah: 'SEPANG', negeri: 'SELANGOR', nama_bantuan: '', negara: '', 
      tarikh_bantuan: '', kos_bantuan: '', catatan: ''
		},
		{
      no_kp: '890901077075', nama_kir: 'Burhanuddin Bin Borhan', alamat: 'Taman Permata, Jalan Pegawai',
      daerah: 'KOTA SETAR', negeri: 'KEDAH', nama_bantuan: '', negara: '', 
      tarikh_bantuan: '', kos_bantuan: '', catatan: ''
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

	getBantuanAntarabangsa(event?: LazyLoadEvent) {
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
