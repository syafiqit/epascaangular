import { Component, OnInit, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { finalize } from 'rxjs/operators';
import { MangsaAntarabangsaServiceProxy } from 'src/app/shared/proxy/service-proxies';
import { TambahEditBantuanAntarabangsaComponent } from './tambah-edit-bantuan-antarabangsa/tambah-edit-bantuan-antarabangsa.component';
import { AppSessionService } from '@app/shared/services/app-session.service';

@Component({
	selector: 'app-bantuan-antarabangsa',
	templateUrl: './bantuan-antarabangsa.component.html',
  encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class BantuanAntarabangsaComponent implements OnInit {
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
    private _refMangsaAntarabangsaServiceProxy: MangsaAntarabangsaServiceProxy,
    public _appSession: AppSessionService
  ) {
    this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
  }

	ngOnInit(): void {
  }

  getBantuanAntarabangsa(event?: LazyLoadEvent) {
		if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this._refMangsaAntarabangsaServiceProxy
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


  addBantuanAntarabangsaModal(mangsaId) {
		const modalRef = this.modalService.open(TambahEditBantuanAntarabangsaComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
		modalRef.componentInstance.idMangsa = mangsaId;

		modalRef.result.then((response) => {
			if (response) {
				this.getBantuanAntarabangsa();
			}
		});
	}

	editBantuanAntarabangsaModal(id, mangsaId) {
		const modalRef = this.modalService.open(TambahEditBantuanAntarabangsaComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'edit';
		modalRef.componentInstance.id = id;
		modalRef.componentInstance.idMangsa = mangsaId;

		modalRef.result.then((response) => {
			if (response) {
				this.getBantuanAntarabangsa();
			}
		});
	}

  reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}

}
