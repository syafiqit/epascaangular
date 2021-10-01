import { Component, OnInit, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { TambahEditMangsaBencanaComponent } from './tambah-edit-mangsa-bencana/tambah-edit-mangsa-bencana.component';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import {
  GetMangsaForEditDto,
  MangsaBencanaServiceProxy,
  MangsaServiceProxy
} from 'src/app/shared/proxy/service-proxies';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { swalSuccess } from '@shared/sweet-alert/swal-constant';
import { Subject } from 'rxjs';

@Component({
	selector: 'app-mangsa-bencana',
	templateUrl: './mangsa-bencana.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class MangsaBencanaComponent implements OnInit {
  @Input() public idMangsa: number;

  @ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

  filter: string;
  terms$ = new Subject<string>();
  getMangsa: GetMangsaForEditDto = new GetMangsaForEditDto();

	constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private _mangsaBencanaServiceProxy: MangsaBencanaServiceProxy,
    private _mangsaServiceProxy: MangsaServiceProxy
  ) {
		this.primengTableHelper = new PrimengTableHelper();
	}

	ngOnInit(): void {
    this.show();

    this.terms$.pipe(
      debounceTime(500), distinctUntilChanged()
    ).subscribe((filterValue: string) =>{
      this.filter = filterValue;
      this.getDisaster();
    });
  }

  applyFilter(filterValue: string){
    this.terms$.next(filterValue);
  }

	show(): void {
		this._mangsaServiceProxy.getMangsaForEdit(this.idMangsa).subscribe((result) => {
			this.getMangsa = result;
		});
	}

	getDisaster(event?: LazyLoadEvent) {
		if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this._mangsaBencanaServiceProxy
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

	reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}

	delete() {
		swalSuccess.fire('Berjaya!', 'Barangan Berjaya Di Buang.', 'success');
	}

	addVictimDisasterModal() {
		const modalRef = this.modalService.open(TambahEditMangsaBencanaComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
    modalRef.componentInstance.id_negeri = this.getMangsa.mangsa.id_negeri;

		modalRef.result.then((response) => {
			if (response) {
				this.getDisaster();
			}
		});
	}

	editVictimDisasterModal(id) {
		const modalRef = this.modalService.open(TambahEditMangsaBencanaComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'edit';
    modalRef.componentInstance.id_negeri = this.getMangsa.mangsa.id_negeri;

		modalRef.componentInstance.id = id;
		modalRef.result.then((response) => {
			if (response) {
				this.getDisaster();
			}
		});
	}
}
