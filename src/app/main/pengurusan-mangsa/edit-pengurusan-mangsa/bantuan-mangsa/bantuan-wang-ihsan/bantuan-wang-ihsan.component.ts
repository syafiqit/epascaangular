import { Component, OnInit, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { finalize } from 'rxjs/operators';
import { MangsaWangIhsanServiceProxy } from 'src/app/shared/proxy/service-proxies';
import { TambahEditBantuanWangIhsanComponent } from './tambah-edit-bantuan-wang-ihsan/tambah-edit-bantuan-wang-ihsan.component';
import { AppSessionService } from '@app/shared/services/app-session.service';
import { ConfirmationService } from '@services/confirmation';

@Component({
	selector: 'app-bantuan-wang-ihsan',
	templateUrl: './bantuan-wang-ihsan.component.html',
  encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class BantuanWangIhsanComponent implements OnInit {
  @Input() public mangsaId: number;

  @ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

  primengTableHelper: PrimengTableHelper;
	filter: string;
  sorting: string;
  skipCount: number;
  maxResultCount: number;
  dateDisasters: any;
  totalDisasters: any;
  statuses: any;

  status=[
    {id: 1, nama_status: "Belum Dibayar"},
    {id: 2, nama_status: "Dibayar"},
    {id: 3, nama_status: "Dipulangkan"}
  ]

	constructor(
    config: NgbModalConfig,
		private modalService: NgbModal,
    private _refMangsaWangIhsanServiceProxy: MangsaWangIhsanServiceProxy,
    public _appSession: AppSessionService,
    private _confirmationService: ConfirmationService
  ) {
    this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
  }

	ngOnInit(): void {
  }

  getIhsan(event?: LazyLoadEvent) {
		this.primengTableHelper.showLoadingIndicator();
		this._refMangsaWangIhsanServiceProxy
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

  addIhsanModal(mangsaId) {
		const modalRef = this.modalService.open(TambahEditBantuanWangIhsanComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
		modalRef.componentInstance.idMangsa = mangsaId;

		modalRef.result.then((response) => {
			if (response) {
				this.getIhsan();
			}
		});
	}

	editIhsanModal(id, mangsaId) {
		const modalRef = this.modalService.open(TambahEditBantuanWangIhsanComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'edit';
		modalRef.componentInstance.id = id;
		modalRef.componentInstance.idMangsa = mangsaId;

		modalRef.result.then((response) => {
			if (response) {
				this.getIhsan();
			}
		});
	}

  getStatus (id){
    this.statuses = this.status.map((data) => {
      return data.nama_status;
    });
    return this.statuses[id - 1];
  }

  reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}

	deleteBwi(id){
		const dialogRef = this._confirmationService.open({
		  title: 'Anda Pasti?',
		  message: 'Adakah anda pasti ingin memadam maklumat bantuan wang ihsan ini?',
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
			this._refMangsaWangIhsanServiceProxy.delete(id).subscribe((result)=>{
				const dialogRef = this._confirmationService.open({
					title: 'Berjaya',
					message: 'Maklumat Mangsa Dipilih Berjaya Dipadam!',
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
					this.getIhsan();
				  });
			})
		  }
		});
	  }
	
	  deleteSuccess() {
		const dialogRef = this._confirmationService.open({
		  title: 'Berjaya',
		  message: 'Maklumat Mangsa Dipilih Berjaya Dipadam!',
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
		  this.getIhsan();
		});
	  }
	
	  deleteUnsuccess() {
		this._confirmationService.open({
		  title: 'Tidak Berjaya',
		  message: 'Maklumat Bantuan Wang Ihsan Tidak Berjaya Dibuang',
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
