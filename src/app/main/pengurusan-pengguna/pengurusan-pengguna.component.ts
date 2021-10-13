import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { NgbDateStruct, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import {
  OutputChangeEmelPasswordDto,
  RefAgensiServiceProxy,
  RefPerananServiceProxy,
  UserServiceProxy
} from 'src/app/shared/proxy/service-proxies';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AppSessionService } from '@app/shared/services/app-session.service';
import { ConfirmationService } from '@app/shared/services/confirmation';

@Component({
	selector: 'app-pengurusan-pengguna',
	templateUrl: './pengurusan-pengguna.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class PengurusanPenggunaComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;
	public isCollapsed = false;
  output: OutputChangeEmelPasswordDto = new OutputChangeEmelPasswordDto()

  filter: string;
  filterAgensi: number;
  filterPeranan: number;
  filterStatus: number;
  filterFromDate: string;
  filterToDate: string;
  saving = false;
  idPengguna: any;
  agencies: any;
  roles: any;
  statuses: any;
  terms$ = new Subject<string>();
  tarikhMula: NgbDateStruct;
  tarikhTamat: NgbDateStruct;
  readonly DELIMITER = '-';

  statusPengguna = [
    { id: 2, nama: 'Berdaftar' },
    { id: 3, nama: 'Tidak Aktif' },
    { id: 4, nama: 'Ditolak' }
  ];

	constructor(
    config: NgbModalConfig,
    private _userServiceProxy: UserServiceProxy,
    private _refAgensiServiceProxy: RefAgensiServiceProxy,
    private _refPerananServiceProxy: RefPerananServiceProxy,
    private _confirmationService: ConfirmationService,
    public _appSession: AppSessionService
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
    if(this.tarikhMula){
      this.filterFromDate = this.toModel(this.tarikhMula);
    }

    if(this.tarikhTamat){
      this.filterToDate = this.toModel(this.tarikhTamat);
    }

		if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this._userServiceProxy
			.getAllUser(
				this.filter,
        this.filterAgensi ?? undefined,
        this.filterPeranan ?? undefined,
        this.filterStatus ?? undefined,
        this.filterFromDate ?? undefined,
        this.filterToDate ?? undefined,
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

  toModel(date: NgbDateStruct | null): string | null {
    return date ? date.year + this.DELIMITER + date.month + this.DELIMITER + date.day : null;
  }

  resetFilter() {
    this.filter = undefined;
    this.filterAgensi = undefined;
    this.filterPeranan = undefined;
    this.filterStatus = undefined;
    this.tarikhMula = undefined;
    this.tarikhTamat = undefined;
    this.filterFromDate = undefined;
    this.filterToDate = undefined;

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

  getStatus(id){
    this.statuses = this.statusPengguna.map(data => data.nama);
    return this.statuses[id - 2];
  }

	reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}

  deleteUser(id){
    const dialogRef = this._confirmationService.open({
      title: 'Anda Pasti?',
      message: 'Adakah anda pasti ingin memadam maklumat pengguna ini?',
      icon: {
        show: true,
        name: 'help-circle',
        color: 'warning'
      },
      actions: {
        confirm: {
          show: true,
          label: 'Ya',
          color: 'primary'
        },
        cancel: {
          show: true,
          label: 'Tidak'
        }
      },
      dismissible: true
    });
    dialogRef.afterClosed().subscribe((e) => {
      if(e === 'confirmed') {
				this._userServiceProxy.delete(id).subscribe((result)=>{
          this.output = result;
          if(this.output.message == "Pengguna Berjaya Dibuang"){
            this.deleteSuccess();
          } else{
            this.deleteUnsuccess();
          }
        })
      }
    });
  }

  deleteSuccess() {
    const dialogRef = this._confirmationService.open({
      title: 'Berjaya',
      message: 'Maklumat Pengguna Dipilih Berjaya Dipadam!',
      icon: {
        show: true,
        name: 'check-circle',
        color: 'success'
      },
      actions: {
        confirm: {
          show: true,
          label: 'Tutup',
          color: 'primary'
        },
        cancel: {
          show: false
        }
      },
      dismissible: true
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getUser();
    });
  }

  deleteUnsuccess() {
    this._confirmationService.open({
      title: 'Tidak Berjaya',
      message: this.output.message,
      icon: {
        show: true,
        name: 'x-circle',
        color: 'error'
      },
      actions: {
        confirm: {
          show: true,
          label: 'Tutup',
          color: 'primary'
        },
        cancel: {
          show: false
        }
      },
      dismissible: true
    });
  }

}
