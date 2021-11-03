import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { NgbCalendar, NgbModalConfig, NgbModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import {
  RefJenisBencanaServiceProxy,
  TabungKelulusanServiceProxy,
  TabungServiceProxy
} from "../../../shared/proxy/service-proxies";
import { PeruntukanDiambilComponent } from './peruntukan-diambil/peruntukan-diambil.component';
import { AppSessionService } from '@app/shared/services/app-session.service';
import { ConfirmationService } from '@services/confirmation';

@Component({
	selector: 'app-kelulusan',
	templateUrl: './kelulusan.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class KelulusanComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

	public isCollapsed = false;
	today = this.calendar.getToday();
	navigation = 'select';
  funds: any;
  categories: any;

  terms$ = new Subject<string>();
  filter: string;
  filterTabung: number;
  filterJenisBencana: number;
  filterFromDate: string;
  filterToDate: string;
  tarikhMula: NgbDateStruct;
  tarikhTamat: NgbDateStruct;
  readonly DELIMITER = '-';

	constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
	  private calendar: NgbCalendar,
    private _tabungKelulusanServiceProxy: TabungKelulusanServiceProxy,
    private _tabungServiceProxy: TabungServiceProxy,
    private _refJenisBencanaServiceProxy: RefJenisBencanaServiceProxy,
    public _appSession: AppSessionService,
		private _confirmationService: ConfirmationService
  ) {
		this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
    this.getTabung();
    this.getJenisBencana();

    this.terms$.pipe(
      debounceTime(500), distinctUntilChanged()
    ).subscribe((filterValue: string) =>{
      this.filter = filterValue;
      this.getTabungKelulusanList();
    });
  }

  getTabungKelulusanList(event?: LazyLoadEvent) {
    if(this.tarikhMula){
      this.filterFromDate = this.toModel(this.tarikhMula);
    }

    if(this.tarikhTamat){
      this.filterToDate = this.toModel(this.tarikhTamat);
    }

		this.primengTableHelper.showLoadingIndicator();
		this._tabungKelulusanServiceProxy
			.getAll(
				this.filter,
        this.filterTabung ?? undefined,
        this.filterJenisBencana ?? undefined,
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


  applyFilter(filterValue: string){
    this.terms$.next(filterValue);
  }

	reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}

  getTabung(filter?) {
    this._tabungServiceProxy.getTabungForDropdown(filter).subscribe((result) => {
      this.funds = result.items;
    });
  }

  getJenisBencana(filter?) {
    this._refJenisBencanaServiceProxy.getRefJenisBencanaForDropdown(filter).subscribe((result) => {
      this.categories = result.items;
    });
  }

  resetFilter() {
    this.filter = undefined;
    this.filterTabung = undefined;
    this.filterJenisBencana = undefined;
    this.filterFromDate = undefined;
    this.filterToDate = undefined;
    this.tarikhMula = undefined;
    this.tarikhTamat = undefined;

    this.getTabungKelulusanList();
  }

  peruntukanDiambilModal(id?, id_tabung?, baki_jumlah_siling?) {
		const modalRef = this.modalService.open(PeruntukanDiambilComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'kelulusan';
    modalRef.componentInstance.id_tabung = id_tabung;
    modalRef.componentInstance.id_tabung_kelulusan = id;
    modalRef.componentInstance.baki_jumlah_siling = baki_jumlah_siling;

    modalRef.result.then((response) => {
			if (response) {
				this.getTabungKelulusanList();
			}
		});
	}

  deleteConfirmation(id?){
    const dialogRef = this._confirmationService.open({
      title: 'Anda Pasti?',
      message: 'Adakah anda pasti ingin memadam maklumat Kelulusan Bayaran ini?',
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
        this._tabungKelulusanServiceProxy.delete(id).subscribe((response)=>{
          if(response.message == 'Kelulusan Sudah Mempunyai Pembayaran'){
            this.alertMessage(response);
          }else{
            this. confirmMessage();
          }
        })
      }
    });
  }

  confirmMessage(){
		const dialogRef = this._confirmationService.open({
		  title: 'Berjaya',
		  message: 'Maklumat Kelulusan Bayaran Berjaya Dipadam.',
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
		  this.getTabungKelulusanList();
		});
	}

	alertMessage(response){
		const dialogRef = this._confirmationService.open({
		  title: 'Tidak Berjaya!',
		  message: response.message,
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
		dialogRef.afterClosed().subscribe(() => {

		});
	}

}
