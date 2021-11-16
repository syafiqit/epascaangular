import { OnInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { TambahEditPengumumanComponent } from './tambah-edit-pengumuman/tambah-edit-pengumuman.component';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { RefPengumumanServiceProxy } from '@app/shared/proxy/service-proxies';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
	selector: 'app-pengumuman',
	templateUrl: './pengumuman.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class PengumumanComponent implements OnInit {
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
    private _refPengumumanServiceProxy: RefPengumumanServiceProxy
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
      this.getAnnouncement();
    });
  }

  applyFilter(filterValue: string){
    this.terms$.next(filterValue);
  }

	getAnnouncement(event?: LazyLoadEvent) {
    if (this.primengTableHelper.shouldResetPaging(event)) {
      this.paginator.changePage(0);
      return;
    }

    this.primengTableHelper.showLoadingIndicator();
    this._refPengumumanServiceProxy
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

	addAnnouncementModal() {
		const modalRef = this.modalService.open(TambahEditPengumumanComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
    modalRef.result.then((response) => {
      if (response) {
        this.getAnnouncement();
      }
    });
	}

	editAnnouncementModal(id) {
		const modalRef = this.modalService.open(TambahEditPengumumanComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'edit';
    modalRef.componentInstance.id = id;
    modalRef.result.then((response) => {
      if (response) {
        this.getAnnouncement();
      }
    });
	}

  resetFilter() {
    this.filter = undefined;
    this.filterStatus = undefined;
    this.filterString = undefined;
    this.applyFilter(this.filterString);
    this.getAnnouncement();
  }
}
