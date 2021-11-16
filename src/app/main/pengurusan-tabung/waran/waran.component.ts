import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { NgbDateStruct, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import {
  OutputCreateBayaranWaranDto,
  RefAgensiServiceProxy,
  TabungBayaranWaranServiceProxy,
  TabungServiceProxy
} from 'src/app/shared/proxy/service-proxies';
import { AppSessionService } from '@app/shared/services/app-session.service';
import { ConfirmationService } from '@app/shared/services/confirmation';

@Component({
	selector: 'app-waran',
	templateUrl: './waran.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class WaranComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;
	public isCollapsed = false;
  output: OutputCreateBayaranWaranDto = new OutputCreateBayaranWaranDto();

  terms$ = new Subject<string>();
	filter: string;
  filterAgensi: number;
  filterTabung: number;
  filterYearTarikhWaran: number;
  filterFromDate: string;
  filterToDate: string;
  tarikhMula: NgbDateStruct;
  tarikhTamat: NgbDateStruct;
  readonly DELIMITER = '-';
  agencies: any;
  funds: any;
  arrayYear:any[];

	constructor(
    config: NgbModalConfig,
    private _tabungBayaranWaranServiceProxy: TabungBayaranWaranServiceProxy,
    private _refAgensiServiceProxy: RefAgensiServiceProxy,
    private _confirmationService: ConfirmationService,
    private _tabungServiceProxy: TabungServiceProxy,
    public _appSession: AppSessionService
  ) {
		this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
    this.getAgensi();
    this.getTabung();
    this.generateArrayOfYears();

    this.terms$.pipe(
      debounceTime(500), distinctUntilChanged()
    ).subscribe((filterValue: string) =>{
      this.filter = filterValue;
      this.getWarrant();
    });
  }

  applyFilter(filterValue: string){
    this.terms$.next(filterValue);
  }

	getWarrant(event?: LazyLoadEvent) {
    if(this.tarikhMula){
      this.filterFromDate = this.toModel(this.tarikhMula);
    }

    if(this.tarikhTamat){
      this.filterToDate = this.toModel(this.tarikhTamat);
    }

		this.primengTableHelper.showLoadingIndicator();
		this._tabungBayaranWaranServiceProxy
			.getAll(
				this.filter,
        this.filterAgensi ?? undefined,
        this.filterTabung ?? undefined,
        this.filterYearTarikhWaran ?? undefined,
        this.filterFromDate ?? undefined,
        this.filterToDate ?? undefined,
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

  toModel(date: NgbDateStruct | null): string | null {
    return date ? date.year + this.DELIMITER + date.month + this.DELIMITER + date.day : null;
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
    this.filterYearTarikhWaran = undefined;
    this.tarikhMula = undefined;
    this.tarikhTamat = undefined;
    this.filterFromDate = undefined;
    this.filterToDate = undefined;

    this.getWarrant();
  }

  generateArrayOfYears() {
    let max = new Date().getFullYear();
    let min = max - 9;
    let years = [];

    for (let i = max; i >= min; i--) {
      years.push(i)
    }
    this.arrayYear = years;
  }

  deleteWaran(id){
    const dialogRef = this._confirmationService.open({
      title: 'Anda Pasti?',
      message: 'Adakah anda pasti ingin memadam maklumat Bayaran Secara Waran ini?',
      icon: {
        show: true,
        name: 'help-circle',
        color: 'warning'
      },
      actions: {
        confirm: {
          show: true,
          label: 'Ya',
          color: 'primary'
        },
        cancel: {
          show: true,
          label: 'Tidak'
        }
      },
      dismissible: true
    });
    dialogRef.afterClosed().subscribe((e) => {
      if(e === 'confirmed') {
				this._tabungBayaranWaranServiceProxy.delete(id).subscribe((result)=>{
          this.output = result;
          if(this.output.message == "Waran Berjaya Dibuang"){
            const dialogRef = this._confirmationService.open({
              title: 'Berjaya',
              message: 'Maklumat Waran Dipilih Berjaya Dipadam',
              icon: {
                show: true,
                name: 'check-circle',
                color: 'success'
              },
              actions: {
                confirm: {
                  show: true,
                  label: 'Tutup',
                  color: 'primary'
                },
                cancel: {
                  show: false
                }
              },
              dismissible: true
            });
            dialogRef.afterClosed().subscribe(() => {
              this.getWarrant();
            });
          } else{
            const dialogRef = this._confirmationService.open({
              title: 'Tidak Berjaya',
              message: this.output.message,
              icon: {
                show: true,
                name: 'x-circle',
                color: 'error'
              },
              actions: {
                confirm: {
                  show: true,
                  label: 'Tutup',
                  color: 'primary'
                },
                cancel: {
                  show: false
                }
              },
              dismissible: true
            });
          }
        })
      }
    });
  }
}
