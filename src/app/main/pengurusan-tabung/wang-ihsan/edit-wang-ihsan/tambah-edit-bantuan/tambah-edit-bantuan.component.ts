import { Component, OnInit, ViewChild, } from '@angular/core';
import { PrimengTableHelper } from '@app/shared/helpers/PrimengTableHelper';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { TambahBantuanComponent } from '../../tambah-bantuan/tambah-bantuan.component';
import { RefDaerahServiceProxy, RefNegeriServiceProxy } from '@app/shared/proxy/service-proxies';

@Component({
  selector: 'app-tambah-edit-bantuan',
  templateUrl: './tambah-edit-bantuan.component.html'
})
export class TambahEditBantuanComponent implements OnInit {
  @ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

  primengTableHelper: PrimengTableHelper;
  public isCollapsed = false;

  rows = [];
  states: any;
  districts: any;
  filterNegeri: number;

  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private _refNegeriServiceProxy: RefNegeriServiceProxy,
    private _refDaerahServiceProxy: RefDaerahServiceProxy
  ) {
    this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
   }

  ngOnInit(): void { }

	getBantuan(event?: LazyLoadEvent) {
		if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this.primengTableHelper.totalRecordsCount = this.rows.length;
		this.primengTableHelper.records = this.rows;
		this.primengTableHelper.hideLoadingIndicator();
	}

  addBantuan() {
		this.modalService.open(TambahBantuanComponent, { size: 'lg' });
  }

  getDaerah(filter?) {
		this._refDaerahServiceProxy.getRefDaerahForDropdown(filter, this.filterNegeri).subscribe((result) => {
			this.districts = result.items;
		});
	}

  getNegeri(filter?) {
		this._refNegeriServiceProxy.getRefNegeriForDropdown(filter).subscribe((result) => {
			this.states = result.items;
		});
	}

}
