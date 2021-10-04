import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { swalError, swalSuccess, swalWarning } from '@app/shared/sweet-alert/swal-constant';
import { NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { OutputCreateBayaranSkbDto, RefAgensiServiceProxy, TabungBayaranSkbServiceProxy, TabungServiceProxy } from 'src/app/shared/proxy/service-proxies';
import { AppSessionService } from '@app/shared/services/app-session.service';

@Component({
	selector: 'app-skb',
	templateUrl: './skb.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class SkbComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;
	public isCollapsed = false;
  output: OutputCreateBayaranSkbDto = new OutputCreateBayaranSkbDto();

  terms$ = new Subject<string>();
  idSkb: any;
	filter: string;
  filterAgensi: number;
  filterTabung: number;
  agencies: any;
  funds: any;

	constructor(
    config: NgbModalConfig,
    private _activatedRoute: ActivatedRoute,
    private _tabungBayaranSkbServiceProxy: TabungBayaranSkbServiceProxy,
    private _refAgensiServiceProxy: RefAgensiServiceProxy,
    private _tabungServiceProxy: TabungServiceProxy,
    public _appSession: AppSessionService
  ) {
    this.idSkb = this._activatedRoute.snapshot.queryParams['id'];
		this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
    this.getAgensi();
    this.getTabung();

    this.terms$.pipe(
      debounceTime(500), distinctUntilChanged()
    ).subscribe((filterValue: string) =>{
      this.filter = filterValue;
      this.getSKB();
    });
  }

  applyFilter(filterValue: string){
    this.terms$.next(filterValue);
  }

	getSKB(event?: LazyLoadEvent) {
    if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this._tabungBayaranSkbServiceProxy
			.getAll(
				this.filter,
        this.filterAgensi ?? undefined,
        this.filterTabung ?? undefined,
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

	reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}

  getAgensi(filter?) {
		this._refAgensiServiceProxy.getRefAgensiForDropdown(filter).subscribe((result) => {
			this.agencies = result.items;
		});
	}

  getTabung(filter?) {
		this._tabungServiceProxy.getTabungForDropdown(filter).subscribe((result) => {
			this.funds = result.items;
		});
	}

  resetFilter() {
    this.filter = undefined;
    this.filterAgensi = undefined;
    this.filterTabung = undefined;

    this.getSKB();
  }

  deleteSkb(id){
		swalWarning.fire({
			title: 'Anda Pasti?',
			text: 'Adakah anda pasti ingin memadam maklumat Surat Kuasa Belanja ini?',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			cancelButtonText: 'Tidak',
			confirmButtonText: 'Ya'
		}).then((result) => {
			if (result.value) {
				this._tabungBayaranSkbServiceProxy.delete(id).subscribe((result)=>{
          this.output = result;
          if(this.output.message == "Surat Kuasa Belanja Berjaya Dibuang"){
            swalSuccess.fire('Berjaya!', 'Surat Kuasa Belanja Dipilih Berjaya Dipadam!').then(()=>{
              this.getSKB();
            });
          }else{
            swalError.fire('Tidak Berjaya!', this.output.message, 'error');
          }
        })
			}
		});
  }
}
