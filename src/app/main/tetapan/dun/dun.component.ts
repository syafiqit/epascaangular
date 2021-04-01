import {AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { TambahEditDunComponent } from './tambah-edit-dun/tambah-edit-dun.component';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import {
  RefDunServiceProxy,
  RefNegeriServiceProxy,
  RefParlimenServiceProxy
} from "../../../shared/proxy/service-proxies";

@Component({
	selector: 'app-dun',
	templateUrl: './dun.component.html',
	encapsulation: ViewEncapsulation.None
})
export class DunComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

  filterDun = '';
  filter: any;
  sorting: any;
  skipCount: any;
  maxResultCount: any;
  filterNegeri: any;
  states: any[];
  parliament: any[];

	constructor(
	  config: NgbModalConfig,
    private modalService: NgbModal,
    private _refDunServiceProxy: RefDunServiceProxy,
    private _refNegeriServiceProxy: RefNegeriServiceProxy,
    private _refParlimenServiceProxy: RefParlimenServiceProxy
  ) {
		config.backdrop = 'static';
		config.keyboard = false;
		this.primengTableHelper = new PrimengTableHelper();
	}

	ngOnInit(): void {
    this.negeri();
    this.parlimen();
	}

	getDun(event?: LazyLoadEvent) {
    if (this.primengTableHelper.shouldResetPaging(event)) {
      this.paginator.changePage(0);
      return;
    }

    this.primengTableHelper.showLoadingIndicator();
    this._refDunServiceProxy
      .getAll(
        this.filterDun,
        this.primengTableHelper.getSorting(this.dataTable),
        this.primengTableHelper.getSkipCount(this.paginator, event),
        this.primengTableHelper.getMaxResultCount(this.paginator, event)
      )
      .subscribe((result) => {
        this.primengTableHelper.totalRecordsCount = result.total_count;
        this.primengTableHelper.records = result.items;
        this.primengTableHelper.hideLoadingIndicator();
      });
	}

  parlimen() {
    this._refParlimenServiceProxy
      .getRefParlimenForDropdown(this.filter)
      .subscribe((result) => {
        this.parliament = result.items.map((data) => {
          return data.nama_parlimen;
        });
      });
  }

  getParlimen(id) {
    return this.parliament[id - 1];
  }

  negeri() {
    this._refNegeriServiceProxy
      .getRefNegeriForDropdown(this.filterNegeri)
      .subscribe((result) => {
        this.states = result.items.map((data) => {
          return data.nama_negeri;
        });
      });
  }

  getNegeri(id) {
    return this.states[id - 1];
  }

	reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}

  addDunModal() {
    const modalRef = this.modalService.open(TambahEditDunComponent, { size: 'lg' });
    modalRef.componentInstance.name = 'add';

    modalRef.result.then((response) => {
      if (response) {
        this.getDun();
      }
    });
  }

  editDunModal(id) {
    const modalRef = this.modalService.open(TambahEditDunComponent, { size: 'lg' });
    modalRef.componentInstance.name = 'edit';
    modalRef.componentInstance.id = id;
    modalRef.result.then((response) => {
      if (response) {
        this.getDun();
      }
    });
  }
}
