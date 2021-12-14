import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { NgbDateStruct, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import {
  RefDaerahServiceProxy,
  RefJenisBencanaServiceProxy,
  RefJenisBwiServiceProxy,
  RefNegeriServiceProxy,
  TabungBwiServiceProxy
} from 'src/app/shared/proxy/service-proxies';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AppSessionService } from '@app/shared/services/app-session.service';
import { ConfirmationService } from '@app/shared/services/confirmation';
@Component({
	selector: 'app-wang-ihsan',
	templateUrl: './wang-ihsan.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class WangIhsanComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

  filter: any;
  filterDaerah: number;
  filterNegeri: number;
  filterJenisBencana: number;
  filterBencana: number;
  filterFromDate: string;
  filterToDate: string;
  filterString: string;
  terms$ = new Subject<string>();
  public isCollapsed = false;
  jenisBencana: any;
  filterJenisBwi: number;
  daerah: any;
  negeri: any;
  tarikhMula: NgbDateStruct;
  tarikhTamat: NgbDateStruct;
  readonly DELIMITER = '-';


	constructor(
    config: NgbModalConfig,
     private tabungBwiServiceProxy: TabungBwiServiceProxy,
     private _refJenisBwiServiceProxy: RefJenisBwiServiceProxy,
     private _refDaerahServiceProxy: RefDaerahServiceProxy,
     private _refNegeriServiceProxy: RefNegeriServiceProxy,
     public _appSession: AppSessionService,
     private _confirmationService: ConfirmationService
  ) {
		this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
    this.getJenisBencana();
    this.getDaerah();
    this.getNegeri();

    this.terms$.pipe(
      debounceTime(500), distinctUntilChanged()
    ).subscribe((filterValue: string) =>{
      this.filter = filterValue;
      this.getBantuanWangIhsan();
    });

  }

  applyFilter(filterValue: string){
    this.terms$.next(filterValue);
  }

	getBantuanWangIhsan(event?: LazyLoadEvent) {
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

    if (this.primengTableHelper.shouldResetPaging(event)) {
      this.paginator.changePage(0);
      return;
    }
    this.primengTableHelper.showLoadingIndicator();

    this.tabungBwiServiceProxy
    .getAll(
      this.filter,
      this.filterJenisBwi ?? undefined,
      this.filterBencana ?? undefined,
      this.filterFromDate ?? undefined,
      this.filterToDate ?? undefined,
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

  toModel(date: NgbDateStruct | null): string | null {
    return date ? date.year + this.DELIMITER + date.month + this.DELIMITER + date.day : null;
  }

  getJenisBencana(filter?) {
		this._refJenisBwiServiceProxy.getRefJenisBwiForDropdown(filter).subscribe((result) => {
			this.jenisBencana = result.items;
		});
	}

  getDaerah(filter?) {
		this._refDaerahServiceProxy.getRefDaerahForDropdown(filter, this.filterNegeri ?? undefined).subscribe((result) => {
			this.daerah = result.items;
		});
	}

  getNegeri(filter?) {
		this._refNegeriServiceProxy.getRefNegeriForDropdown(filter).subscribe((result) => {
			this.negeri = result.items;
		});
	}

  resetFilter() {
    this.filter = undefined;
    this.filterDaerah = undefined;
    this.filterNegeri = undefined;
    this.filterJenisBwi = undefined;
    this.tarikhMula = undefined;
    this.tarikhTamat = undefined;
    this.filterFromDate = undefined;
    this.filterToDate = undefined;
    this.filterString = undefined;
    this.applyFilter(this.filterString);
    this.getBantuanWangIhsan();
  }

	reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}

  padamWangIhsan(id?) {
    const dialogRef = this._confirmationService.open({
      title: 'Anda Pasti?',
      message: 'Adakah anda pasti ingin memadam Bantuan Wang Ihsan ini?',
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
				this.tabungBwiServiceProxy.delete(id).subscribe((result)=>{
          if(result.message == "Bantuan Wang Ihsan Berjaya Dibuang"){
            const dialogRef = this._confirmationService.open({
              title: 'Berjaya',
              message: "Bantuan Wang Ihsan Berjaya Dipadam",
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
              this.getBantuanWangIhsan();
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
}
