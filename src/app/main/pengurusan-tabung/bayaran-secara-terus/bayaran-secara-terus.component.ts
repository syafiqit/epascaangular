import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { NgbDateStruct, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { TabungBayaranTerusServiceProxy} from 'src/app/shared/proxy/service-proxies';
import { Subject } from 'rxjs';
import { AppSessionService } from '@app/shared/services/app-session.service';
import { ConfirmationService } from '@app/shared/services/confirmation';

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
  filterFromDate: string;
  filterToDate: string;
  filterString: string;
  terms$ = new Subject<string>();

  tarikhMula: NgbDateStruct;
  tarikhTamat: NgbDateStruct;
  readonly DELIMITER = '-';
  public isCollapsed = false;

	constructor(
    config: NgbModalConfig,
    private _tabungBayaranTerusServiceProxy: TabungBayaranTerusServiceProxy,
    public _appSession: AppSessionService,
    private _confirmationService: ConfirmationService
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

    if(this.tarikhMula){
      this.filterFromDate = this.toModel(this.tarikhMula);
    }

    if(this.tarikhTamat){
      this.filterToDate = this.toModel(this.tarikhTamat);
    }

		this.primengTableHelper.showLoadingIndicator();
		this._tabungBayaranTerusServiceProxy
			.getAll(
				this.filter,
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

  toModel(date: NgbDateStruct | null): string | null {
    return date ? date.year + this.DELIMITER + date.month + this.DELIMITER + date.day : null;
  }

  resetFilter() {
    this.filter = undefined;
    this.tarikhMula = undefined;
    this.tarikhTamat = undefined;
    this.filterFromDate = undefined;
    this.filterToDate = undefined;
    this.filterString = undefined;
    this.applyFilter(this.filterString);
    this.getBayaranTerus();
  }

  padamBayaranTerus(id?) {
      const dialogRef = this._confirmationService.open({
        title: 'Anda Pasti?',
        message: 'Adakah anda pasti ingin memadam maklumat Pembayaran Secara Terus ini?',
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
      });dialogRef.afterClosed().subscribe((e) => {
        if(e === 'confirmed') {
          this._tabungBayaranTerusServiceProxy.delete(id).subscribe((result)=>{
            if(result.message == "Bayaran Terus Berjaya Dibuang"){
              const dialogRef = this._confirmationService.open({
                title: 'Berjaya',
                message: "Bayaran Terus Berjaya Dipadam",
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
                this.getBayaranTerus();
              });
            }else{
              this._confirmationService.open({
                title: 'Tidak Berjaya',
                message: result.message,
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

	reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}
}
