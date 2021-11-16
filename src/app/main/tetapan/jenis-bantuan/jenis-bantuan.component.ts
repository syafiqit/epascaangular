import { OnInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { TambahEditJenisBantuanComponent } from './tambah-edit-jenis-bantuan/tambah-edit-jenis-bantuan.component';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { RefBantuanServiceProxy } from 'src/app/shared/proxy/service-proxies';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
	selector: 'app-jenis-bantuan',
	templateUrl: './jenis-bantuan.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class JenisBantuanComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

	filter: string;
  filterStatus: number;
  filterString: string;
  public isCollapsed = false;
  terms$ = new Subject<string>();

  status=[
    {id: 1, nama_status: 'Aktif'},
    {id: 2, nama_status: 'Tidak Aktif'}
  ]

	constructor(
		config: NgbModalConfig,
		private modalService: NgbModal,
		private _refBantuanServiceProxy: RefBantuanServiceProxy
	) {
		config.backdrop = 'static';
		config.keyboard = false;
		this.primengTableHelper = new PrimengTableHelper();
	}

	ngOnInit(): void {
    this.terms$.pipe(
      debounceTime(500), distinctUntilChanged()
    ).subscribe((filterValue: string) =>{
      this.filter = filterValue;
      this.getBantuan();
    });
  }

  applyFilter(filterValue: string){
    this.terms$.next(filterValue);
  }

	getBantuan(event?: LazyLoadEvent) {
		this.primengTableHelper.showLoadingIndicator();
		this._refBantuanServiceProxy
			.getAll(
				this.filter,
        this.filterStatus ?? undefined,
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

	reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}

  resetFilter() {
    this.filter = undefined;
    this.filterStatus = undefined;
    this.filterString = undefined;
    this.applyFilter(this.filterString);
    this.getBantuan();
  }

	addHelpDonationModal() {
		const modalRef = this.modalService.open(TambahEditJenisBantuanComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
		modalRef.result.then((response) => {
			if (response) {
				this.getBantuan();
			}
		});
	}

	editHelpDonationModal(id) {
		const modalRef = this.modalService.open(TambahEditJenisBantuanComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'edit';
		modalRef.componentInstance.id = id;
		modalRef.result.then((response) => {
			if (response) {
				this.getBantuan();
			}
		});
	}
}
