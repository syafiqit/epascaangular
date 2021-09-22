import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PrimengTableHelper } from '@app/shared/helpers/PrimengTableHelper';
import { CreateOrEditTabungKelulusanDto, TabungKelulusanServiceProxy } from '@app/shared/proxy/service-proxies';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PeruntukanDiambilComponent } from '../../peruntukan-diambil/peruntukan-diambil.component';

@Component({
  selector: 'app-peruntukan-diambil-list',
  templateUrl: './peruntukan-diambil-list.component.html'
})
export class PeruntukanDiambilListComponent implements OnInit {

  @ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

  primengTableHelper: PrimengTableHelper;

  kelulusan: CreateOrEditTabungKelulusanDto = new CreateOrEditTabungKelulusanDto();
  id:number;

  rowBwi = [
    {
      tarikh: '20/02/2021', jumlah_siling_semasa: 'RM 8,000.00', jumlah_peruntukan_diambil: 'RM 2,000.00', 
      jumlah_peruntukan_baru:'RM 6,000.00'
		},
		{
      tarikh: '20/01/2021', jumlah_siling_semasa: 'RM 10,000.00', jumlah_peruntukan_diambil: 'RM 2,000.00', 
      jumlah_peruntukan_baru:'RM 8,000.00'
		}
	];

  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private _tabungKelulusanServiceProxy: TabungKelulusanServiceProxy,
    private _activatedRoute: ActivatedRoute
  ) { 
    this.id = this._activatedRoute.snapshot.queryParams['id'];
    this.primengTableHelper = new PrimengTableHelper();
    config.backdrop = 'static';
		config.keyboard = false;
  }

  ngOnInit(): void {
    this.show();
  }

  show() {
    if (!this.id) {
      this.kelulusan = new CreateOrEditTabungKelulusanDto();
    } else {
      this._tabungKelulusanServiceProxy.getTabungKelulusanForEdit(this.id).subscribe((result) => {
        this.kelulusan = result.tabung_kelulusan;
      });
    }
  }

  getSejarahBwi(event?: LazyLoadEvent) {
		if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this.primengTableHelper.totalRecordsCount = this.rowBwi.length;
		this.primengTableHelper.records = this.rowBwi;
		this.primengTableHelper.hideLoadingIndicator();
	}

  peruntukanDiambilModal(id?, id_tabung?, baki_jumlah_siling?) {
		const modalRef = this.modalService.open(PeruntukanDiambilComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
    modalRef.componentInstance.id_tabung = id_tabung;
    modalRef.componentInstance.id_tabung_kelulusan = id;
    modalRef.componentInstance.baki_jumlah_siling = id;
    modalRef.result.then(
			(response) => {
				if (response) {
          // this.kelulusan.id_bencana = response.id;
				}
			}
		);
	}

}
