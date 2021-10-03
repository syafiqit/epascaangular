import { Component, OnInit, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { TambahEditAhliRumahMangsaComponent } from './tambah-edit-ahli-rumah-mangsa/tambah-edit-ahli-rumah-mangsa.component';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { LazyLoadEvent } from 'primeng/api';
import {
  GetMangsaForEditDto,
  MangsaAirServiceProxy,
  MangsaServiceProxy
} from 'src/app/shared/proxy/service-proxies';
import { finalize } from 'rxjs/operators';
import { swalSuccess } from '@shared/sweet-alert/swal-constant';
import { AppSessionService } from '@app/shared/services/app-session.service';

@Component({
	selector: 'app-ahli-rumah-mangsa',
	templateUrl: './ahli-rumah-mangsa.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class AhliRumahMangsaComponent implements OnInit {
  @Input() public idMangsa: number;

	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

	public isCollapsed = false;

  filter: string;
  mangsaId: any;
  victims: any;
  getMangsa: GetMangsaForEditDto = new GetMangsaForEditDto();

	constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private _mangsaAirServiceProxy: MangsaAirServiceProxy,
    private _mangsaServiceProxy: MangsaServiceProxy,
    public _appSession: AppSessionService
    ) {
		this.primengTableHelper = new PrimengTableHelper();
	}

	ngOnInit(): void {
    this.show();
  }

	show(): void {
		this._mangsaServiceProxy.getMangsaForEdit(this.idMangsa).subscribe((result) => {
			this.getMangsa = result;
		});
	}

	reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}

	getHousehold(event?: LazyLoadEvent) {
		if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this._mangsaAirServiceProxy
			.getAllByIdMangsa(
        this.idMangsa,
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

	delete() {
		swalSuccess.fire('Berjaya!', 'Barangan Berjaya Dibuang.', 'success');
	}

	addAhliRumahModal() {
		const modalRef = this.modalService.open(TambahEditAhliRumahMangsaComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
		modalRef.result.then((response) => {
			if (response) {
				this.getHousehold();
			}
		});
	}

	editAhliRumahModal(id) {
		const modalRef = this.modalService.open(TambahEditAhliRumahMangsaComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'edit';
		modalRef.componentInstance.id = id;
		modalRef.result.then((response) => {
			if (response) {
				this.getHousehold();
			}
		});
	}
}
