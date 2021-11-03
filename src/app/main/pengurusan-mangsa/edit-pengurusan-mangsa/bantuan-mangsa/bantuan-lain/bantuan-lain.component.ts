import { Component, OnInit, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { finalize } from 'rxjs/operators';
import { TambahEditBantuanLainComponent } from './tambah-edit-bantuan-lain/tambah-edit-bantuan-lain.component';
import { MangsaBantuanServiceProxy } from 'src/app/shared/proxy/service-proxies';
import { AppSessionService } from '@app/shared/services/app-session.service';
import { ConfirmationService } from '@services/confirmation';

@Component({
	selector: 'app-bantuan-lain',
	templateUrl: './bantuan-lain.component.html',
  encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class BantuanLainComponent implements OnInit {
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

	constructor(
    config: NgbModalConfig,
		private modalService: NgbModal,
    private _refMangsaBantuanServiceProxy: MangsaBantuanServiceProxy,
    public _appSession: AppSessionService,
	private _confirmationService: ConfirmationService
  ) {
    this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
  }

	ngOnInit(): void {
  }

  getBantuanLain(event?: LazyLoadEvent) {
		this.primengTableHelper.showLoadingIndicator();
		this._refMangsaBantuanServiceProxy
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


  addBantuanLainModal(mangsaId) {
		const modalRef = this.modalService.open(TambahEditBantuanLainComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
		modalRef.componentInstance.idMangsa = mangsaId;

		modalRef.result.then((response) => {
			if (response) {
				this.getBantuanLain();
			}
		});
	}

	editBantuanLainModal(id, mangsaId) {
		const modalRef = this.modalService.open(TambahEditBantuanLainComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'edit';
		modalRef.componentInstance.id = id;
		modalRef.componentInstance.idMangsa = mangsaId;

		modalRef.result.then((response) => {
			if (response) {
				this.getBantuanLain();
			}
		});
	}

  reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}

  padamBantuanLain(id?){
    const dialogRef = this._confirmationService.open({
      title: 'Anda Pasti?',
      message: 'Adakah anda pasti ingin memadam bantuan lain ini?',
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
        this._refMangsaBantuanServiceProxy.delete(id).subscribe((response)=>{
            this. confirmMessage();
        })
      }
    });
  }

  confirmMessage(){
		const dialogRef = this._confirmationService.open({
		  title: 'Berjaya',
		  message: 'Bantuan Lain Berjaya Dipadam.',
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
			this.getBantuanLain();
		});
	}

}
