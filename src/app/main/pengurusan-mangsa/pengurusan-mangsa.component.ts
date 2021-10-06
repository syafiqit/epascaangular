import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { LazyLoadEvent } from 'primeng/api';
import {
  MangsaServiceProxy,
  RefAgensiServiceProxy,
  RefNegeriServiceProxy
} from 'src/app/shared/proxy/service-proxies';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { EditMultipleBantuanWangIhsanComponent } from './edit-multiple-bantuan-wang-ihsan/edit-multiple-bantuan-wang-ihsan.component';
import { swalError } from '@app/shared/sweet-alert/swal-constant';
import { AppSessionService } from '@app/shared/services/app-session.service';
import { CreateMultipleBencanaComponent } from './create-multiple-bencana/create-multiple-bencana.component';

@Component({
	selector: 'app-pengurusan-mangsa',
	templateUrl: './pengurusan-mangsa.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class PengurusanMangsaComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

	filter: string;
  filterNegeri: number;
  filterAgensi: number;
  terms$ = new Subject<string>();
  checked: boolean;
  idMangsa: any[];

	public isCollapsed = false;
  states: any;
  agencies: any;

	constructor(
		config: NgbModalConfig,
		private modalService: NgbModal,
    private _mangsaServiceProxy: MangsaServiceProxy,
    private _refAgensiServiceProxy: RefAgensiServiceProxy,
    private _refNegeriServiceProxy: RefNegeriServiceProxy,
    public _appSession: AppSessionService
  ) {
		this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
    this.getNegeri();
    this.getAgensi();
	this.idMangsa = [];

    this.terms$.pipe(
      debounceTime(500), distinctUntilChanged()
    ).subscribe((filterValue: string) =>{
      this.filter = filterValue;
      this.getVictim();
    });

  }

  applyFilter(filterValue: string){
    this.terms$.next(filterValue);
  }

	getVictim(event?: LazyLoadEvent) {
    if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this._mangsaServiceProxy
			.getAll(
				this.filter,
        this.filterNegeri ?? undefined,
        this.filterAgensi ?? undefined,
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

  resetFilter() {
    this.filter = undefined;
    this.filterAgensi = undefined;
    this.filterNegeri = undefined;

    this.getVictim();
  }

  getNegeri(filter?) {
		this._refNegeriServiceProxy.getRefNegeriForDropdown(filter).subscribe((result) => {
			this.states = result.items;
		});
	}

  getAgensi(filter?) {
		this._refAgensiServiceProxy.getRefAgensiForDropdown(filter).subscribe((result) => {
			this.agencies = result.items;
		});
	}

	reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}

	checkedAll(isChecked: boolean) {
		if (isChecked) {
			this.checked = true;
		}
		else if (!isChecked) {
			this.checked = false;
		}
	}

	pilihMangsa(id, isChecked: boolean) {
		if (isChecked) {
			this.idMangsa.push(id);
		} else if (!isChecked) {
			let index = this.idMangsa.indexOf(id);
			this.idMangsa.splice(index, 1);
			}
		}

	checkMangsaExist(id?){
		if(this.idMangsa.indexOf(id)  == -1){
			return false;
		}
		else{
			return true;
		};
	}

	editIhsanModal() {
		if(this.idMangsa.length == 0){
			swalError.fire('Harap Maaf!', 'Tiada Mangsa Dipilih.');
		}else{
			const modalRef = this.modalService.open(EditMultipleBantuanWangIhsanComponent, { size: 'lg' });
			modalRef.componentInstance.name = 'edit';
			modalRef.componentInstance.idMangsa = this.idMangsa;

			modalRef.result.then((response) => {
			if (response) {
				this.getVictim();
			}
		});
		}
	}

	editBencanaModal() {
		if(this.idMangsa.length == 0){
			swalError.fire('Harap Maaf!', 'Tiada Mangsa Dipilih.');
		}else{
			const modalRef = this.modalService.open(CreateMultipleBencanaComponent, { size: 'lg' });
			modalRef.componentInstance.name = 'edit';
			modalRef.componentInstance.idMangsa = this.idMangsa;

			modalRef.result.then((response) => {
			if (response) {
				this.getVictim();
			}
		});
		}
	}
}
