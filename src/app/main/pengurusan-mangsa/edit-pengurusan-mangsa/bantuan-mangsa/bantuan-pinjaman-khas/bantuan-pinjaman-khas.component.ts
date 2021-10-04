import { Component, OnInit, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { finalize } from 'rxjs/operators';
import { TambahEditBantuanPinjamanKhasComponent } from './tambah-edit-bantuan-pinjaman-khas/tambah-edit-bantuan-pinjaman-khas.component';
import { MangsaPinjamanServiceProxy } from 'src/app/shared/proxy/service-proxies';
import { AppSessionService } from '@app/shared/services/app-session.service';
import { swalError, swalSuccess, swalWarning } from '@app/shared/sweet-alert/swal-constant';

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

	constructor(
    config: NgbModalConfig,
		private modalService: NgbModal,
    private _refMangsaPinjamanServiceProxy: MangsaPinjamanServiceProxy,
    public _appSession: AppSessionService
  ) {
    this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
  }

	ngOnInit(): void {
  }

  getPinjaman(event?: LazyLoadEvent) {
		if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

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

  padamBantuanPinjaman(id?) {
    swalWarning.fire({
      title: 'Anda Pasti?',
      text: 'Adakah anda pasti ingin padam bantuan pinjaman ini?',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Tidak',
      confirmButtonText: 'Ya'
    }).then((result) => {
      if (result.value) {
        this._refMangsaPinjamanServiceProxy.delete(id).subscribe((result) => {
          if(result.message == "Bantuan Pinjaman Khas Berjaya Dibuang"){
            swalSuccess.fire('Berjaya!', result.message);
          }
          else{
            swalError.fire('Tidak Berjaya!', 'Bantuan Pinjaman Khas Tidak Berjaya Dibuang');
          }
          this.getPinjaman();
        })
      }
    });
  }

}
