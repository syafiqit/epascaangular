import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import {
  RefAgensiServiceProxy,
  RefPerananServiceProxy,
  UserServiceProxy
} from 'src/app/shared/proxy/service-proxies';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
declare let require;
const Swal = require('sweetalert2');

@Component({
	selector: 'app-permohonan-pengguna',
	templateUrl: './permohonan-pengguna.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class PermohonanPenggunaComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;
	public isCollapsed = false;
  filter: string;
  filterAgensi: number;
  filterPeranan: number;
  saving = false;
  agencies: any;
  roles: any;
  statuses: any;
  terms$ = new Subject<string>();

  statusPengguna = [
    { id: 1, nama: "Permohonan" },
    { id: 2, nama: "Berdaftar" },
    { id: 3, nama: "Tidak Aktif" },
    { id: 4, nama: "Ditolak" }
  ]

	constructor(
    config: NgbModalConfig,
    private _userServiceProxy: UserServiceProxy,
    private _refAgensiServiceProxy: RefAgensiServiceProxy,
    private _refPerananServiceProxy: RefPerananServiceProxy
  ) {
    this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
    this.getAgensi();
    this.getPeranan();

    this.terms$.pipe(
      debounceTime(500), distinctUntilChanged()
    ).subscribe((filterValue: string) =>{
      this.filter = filterValue;
      this.getUser();
    });

  }

  applyFilter(filterValue: string){
    this.terms$.next(filterValue);
  }

	getUser(event?: LazyLoadEvent) {
		if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this._userServiceProxy
			.getAllPermohonanUser(
				this.filter,
        this.filterAgensi ?? undefined,
        this.filterPeranan ?? undefined,
				this.primengTableHelper.getSorting(this.dataTable),
				this.primengTableHelper.getSkipCount(this.paginator, event),
				this.primengTableHelper.getMaxResultCount(this.paginator, event)
			)
      .pipe(
				finalize(() => {
					this.primengTableHelper.hideLoadingIndicator();
				})
			)
			.subscribe((result) => {
				this.primengTableHelper.totalRecordsCount = result.total_count;
				this.primengTableHelper.records = result.items;
			});
	}

  resetFilter() {
    this.filter = undefined;
    this.filterAgensi = undefined;
    this.filterPeranan = undefined;

    this.getUser();
  }

  getAgensi(filter?) {
		this._refAgensiServiceProxy.getRefAgensiForDropdown(filter).subscribe((result) => {
			this.agencies = result.items;
		});
	}

  getPeranan(filter?) {
		this._refPerananServiceProxy.getRefPerananForDropdown(filter).subscribe((result) => {
			this.roles = result.items;
		});
	}

  getStatus (id){
    this.statuses = this.statusPengguna.map((data) => {
      return data.nama;
    });
    return this.statuses[id - 1];
  }

	reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}

}
