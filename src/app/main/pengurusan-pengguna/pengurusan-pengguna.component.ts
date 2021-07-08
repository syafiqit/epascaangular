import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { TambahEditPengurusanPenggunaComponent } from './tambah-edit-pengurusan-pengguna/tambah-edit-pengurusan-pengguna.component';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import {
  RefAgensiServiceProxy,
  RefPerananServiceProxy,
  UserServiceProxy
} from 'src/app/shared/proxy/service-proxies';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
declare let require;
const Swal = require('sweetalert2');

@Component({
	selector: 'app-pengurusan-pengguna',
	templateUrl: './pengurusan-pengguna.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class PengurusanPenggunaComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;
	public isCollapsed = false;
  filter: string;
  filterAgensi: number;
  filterPeranan: number;
  saving = false;
  idPengguna: any;
  agencies: any;
  roles: any;
  terms$ = new Subject<string>();

	constructor(
    private _activatedRoute: ActivatedRoute,
    config: NgbModalConfig,
    private modalService: NgbModal,
    private _userServiceProxy: UserServiceProxy,
    private _refAgensiServiceProxy: RefAgensiServiceProxy,
    private _refPerananServiceProxy: RefPerananServiceProxy
  ) {
    this.idPengguna = this._activatedRoute.snapshot.queryParams['id'];
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
    if(this.filterAgensi == null){
      this.filterAgensi = undefined;
    }

    if(this.filterPeranan == null){
      this.filterPeranan = undefined;
    }

		if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this._userServiceProxy
			.getAllUser(
				this.filter,
        this.filterAgensi,
        this.filterPeranan,
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

  approveUser(id){
    this._userServiceProxy.approvedUser(id).subscribe(() => {
			Swal.fire('Berjaya!', 'Pengguna Berjaya Disahkan.', 'success').then(() => {
				this.getUser();
			});
		});
  }

	reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}

	addUserModal() {
		this.modalService.open(TambahEditPengurusanPenggunaComponent, { size: 'lg' });
	}

  approveConfirmation(id) {
    Swal.fire({
			title: 'Anda Pasti?',
			text: 'Adakah anda pasti ingin sahkan pengguna ini?',
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			cancelButtonText: 'Tidak',
			confirmButtonText: 'Ya!'
		}).then((result) => {
      if (result.value) {
        this._userServiceProxy.approvedUser(id).subscribe(() => {
          Swal.fire('Berjaya!', 'Pengguna berjaya disahkan.', 'success').then(() => {
            this.getUser();
          });
        });
      }
    });
	}

}
