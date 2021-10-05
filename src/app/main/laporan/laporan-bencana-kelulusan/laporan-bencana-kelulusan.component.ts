import { OnInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { SelectBencanaComponent } from '@app/main/pengurusan-mangsa/select-bencana/select-bencana.component';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { RefJenisBencanaServiceProxy } from 'src/app/shared/proxy/service-proxies';

@Component({
	selector: 'app-laporan-bencana-kelulusan',
	templateUrl: './laporan-bencana-kelulusan.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class LaporanBencanaKelulusanComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;
	public isCollapsed = false;

  disasters: any;
  filterBencana: number;
  nama_bencana: string;

	rows = [
		{
      jenis_bencana: 'Banjir', jumlah_kelulusan: '38000.00', jumlah_peruntukan: '38000.00',
      baki_pulangan: '2000.00', jumlah_agihan: '36000.00', baki: '-'
		},
		{
      jenis_bencana: 'Banjir', jumlah_kelulusan: '50000.00', jumlah_peruntukan: '50000.00',
      baki_pulangan: '5000.00', jumlah_agihan: '45000.00', baki: '-'
		}
	];

	constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private _refJenisBencanaServiceProxy: RefJenisBencanaServiceProxy
  ) {
		this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
    this.getBencana();
  }

	getBencanaKelulusanReport(event?: LazyLoadEvent) {
		if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this.primengTableHelper.totalRecordsCount = this.rows.length;
		this.primengTableHelper.records = this.rows;
		this.primengTableHelper.hideLoadingIndicator();
	}

  getBencana(filter?) {
		this._refJenisBencanaServiceProxy.getRefJenisBencanaForDropdown(filter).subscribe((result) => {
			this.disasters = result.items;
		});
	}

	reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}

	pilihBencana() {
		const modalRef = this.modalService.open(SelectBencanaComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
    modalRef.result.then(
			(response) => {
				if (response) {
          this.filterBencana = response.id;
          this.nama_bencana = response.nama_bencana;
				}
			}
		);
	}
}
