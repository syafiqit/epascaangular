import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { TabungBayaranTerusServiceProxy} from 'src/app/shared/proxy/service-proxies';
import { Subject } from 'rxjs';
import { swalError, swalSuccess, swalWarning } from '@app/shared/sweet-alert/swal-constant';
import { AppSessionService } from '@app/shared/services/app-session.service';

@Component({
	selector: 'app-bayaran-secara-terus',
	templateUrl: './bayaran-secara-terus.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class BayaranSecaraTerusComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

  filter: string;
  terms$ = new Subject<string>();

	constructor(
    config: NgbModalConfig,
    private _tabungBayaranTerusServiceProxy: TabungBayaranTerusServiceProxy,
    public _appSession: AppSessionService
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
      this.getBayaranTerus();
    });
  }

  applyFilter(filterValue: string){
    this.terms$.next(filterValue);
  }

	getBayaranTerus(event?: LazyLoadEvent) {
    if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this._tabungBayaranTerusServiceProxy
			.getAll(
				this.filter,
				this.primengTableHelper.getSorting(this.dataTable),
				this.primengTableHelper.getSkipCount(this.paginator, event),
				this.primengTableHelper.getMaxResultCount(this.paginator, event)
			)
      .pipe(finalize(()=> {
        this.primengTableHelper.hideLoadingIndicator();
      }))
			.subscribe((result) => {
				this.primengTableHelper.totalRecordsCount = result.total_count;
				this.primengTableHelper.records = result.items;
			});
	}

  padamBayaranTerus(id?) {
    swalWarning.fire({
      title: 'Anda Pasti?',
      text: 'Adakah anda pasti ingin padam pembayaran secara terus ini?',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Tidak',
      confirmButtonText: 'Ya'
    }).then((result) => {
      if (result.value) {
        this._tabungBayaranTerusServiceProxy.delete(id).subscribe((result) => {
          if(result.message == "Bayaran Terus Berjaya Dibuang"){
            swalSuccess.fire('Berjaya!', result.message);
          }
          else{
            swalError.fire('Tidak Berjaya!', result.message);
          }
          this.getBayaranTerus();
        })
      }
    });
  }

	reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}
}
