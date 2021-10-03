import { Component, OnInit, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { finalize } from 'rxjs/operators';
import { MangsaPertanianServiceProxy, MangsaPinjamanServiceProxy } from 'src/app/shared/proxy/service-proxies';
import { TambahEditBantuanPertanianComponent } from './tambah-edit-bantuan-pertanian/tambah-edit-bantuan-pertanian.component';
import { AppSessionService } from '@app/shared/services/app-session.service';

@Component({
	selector: 'app-bantuan-pertanian',
	templateUrl: './bantuan-pertanian.component.html',
  encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class BantuanPertanianComponent implements OnInit {
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
    private _refMangsaPertanianServiceProxy: MangsaPertanianServiceProxy,
    public _appSession: AppSessionService
  ) {
    this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
  }

	ngOnInit(): void {
  }

  getAgriculture(event?: LazyLoadEvent) {
		if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this._refMangsaPertanianServiceProxy
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


  addAgricultureModal(mangsaId) {
		const modalRef = this.modalService.open(TambahEditBantuanPertanianComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
		modalRef.componentInstance.idMangsa = mangsaId;

		modalRef.result.then((response) => {
			if (response) {
				this.getAgriculture();
			}
		});
	}

	editAgricultureModal(id, mangsaId) {
		const modalRef = this.modalService.open(TambahEditBantuanPertanianComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'edit';
		modalRef.componentInstance.id = id;
		modalRef.componentInstance.idMangsa = mangsaId;

		modalRef.result.then((response) => {
			if (response) {
				this.getAgriculture();
			}
		});
	}

  reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}

}
