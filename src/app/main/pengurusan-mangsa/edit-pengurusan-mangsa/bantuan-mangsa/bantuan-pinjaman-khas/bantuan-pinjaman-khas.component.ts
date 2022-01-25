import { Component, OnInit, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { TambahEditBantuanPinjamanKhasComponent } from './tambah-edit-bantuan-pinjaman-khas/tambah-edit-bantuan-pinjaman-khas.component';
import { MangsaPinjamanServiceProxy } from 'src/app/shared/proxy/service-proxies';
import { AppSessionService } from '@app/shared/services/app-session.service';
import { ConfirmationService } from '@services/confirmation';
import { Subject } from 'rxjs';

@Component({
	selector: 'app-bantuan-pinjaman-khas',
	templateUrl: './bantuan-pinjaman-khas.component.html',
  encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class BantuanPinjamanKhasComponent implements OnInit {
	@Input() public mangsaId: any;

  @ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

  primengTableHelper: PrimengTableHelper;
	filter: string;
  sorting: string;
  skipCount: number;
  maxResultCount: number;
  dateDisasters: any;
  totalDisasters: any;
  terms$ = new Subject<string>();

	constructor(
    config: NgbModalConfig,
		private modalService: NgbModal,
    private _refMangsaPinjamanServiceProxy: MangsaPinjamanServiceProxy,
    public _appSession: AppSessionService,
	private _confirmationService: ConfirmationService
  ) {
    this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
  }

	ngOnInit(): void {
    this.terms$.pipe(
      debounceTime(500), distinctUntilChanged()
    ).subscribe((filterValue: string) =>{
      this.filter = filterValue;
      this.getPinjaman();
    });
  }

  applyFilter(filterValue: string){
    this.terms$.next(filterValue);
  }

  getPinjaman(event?: LazyLoadEvent) {
		this.primengTableHelper.showLoadingIndicator();
		this._refMangsaPinjamanServiceProxy
			.getAllByIdMangsa(
        this.mangsaId,
				this.filter,
				this.primengTableHelper.getSorting(this.dataTable),
				this.primengTableHelper.getSkipCount(this.paginator, event),
				this.primengTableHelper.getMaxResultCount(this.paginator, event)
			)
			.pipe(finalize(()=>{
        this.primengTableHelper.hideLoadingIndicator();
      }))
			.subscribe((result) => {
				this.primengTableHelper.totalRecordsCount = result.total_count;
				this.primengTableHelper.records = result.items;
			});
	}


  addPinjamanModal(mangsaId) {
		const modalRef = this.modalService.open(TambahEditBantuanPinjamanKhasComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
		modalRef.componentInstance.idMangsa = mangsaId;

		modalRef.result.then((response) => {
			if (response) {
				this.getPinjaman();
			}
		});
	}

	editPinjamanModal(id, mangsaId) {
		const modalRef = this.modalService.open(TambahEditBantuanPinjamanKhasComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'edit';
		modalRef.componentInstance.id = id;
		modalRef.componentInstance.idMangsa = mangsaId;

		modalRef.result.then((response) => {
			if (response) {
				this.getPinjaman();
			}
		});
	}

  reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}

  padamBantuanPinjaman(id?){
    const dialogRef = this._confirmationService.open({
      title: 'Anda Pasti?',
      message: 'Adakah anda pasti ingin memadam bantuan pinjaman ini?',
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
        this._refMangsaPinjamanServiceProxy.delete(id).subscribe((response)=>{
            this. confirmMessage();
        })
      }
    });
  }

  confirmMessage(){
		const dialogRef = this._confirmationService.open({
		  title: 'Berjaya',
		  message: 'Bantuan Pinjaman Khas Berjaya Dipadam',
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
			this.getPinjaman();
		});
	}

}
