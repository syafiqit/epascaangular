import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { NgbCalendar, NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
import { swalError, swalSuccess, swalWarning } from '@shared/sweet-alert/swal-constant';
import { AppSessionService } from '@app/shared/services/app-session.service';

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

	constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
	  private calendar: NgbCalendar,
    private _tabungKelulusanServiceProxy: TabungKelulusanServiceProxy,
    private _tabungServiceProxy: TabungServiceProxy,
    private _refJenisBencanaServiceProxy: RefJenisBencanaServiceProxy,
    public _appSession: AppSessionService
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
    if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this._tabungKelulusanServiceProxy
			.getAll(
				this.filter,
        this.filterTabung ?? undefined,
        this.filterJenisBencana ?? undefined,
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

    this.getTabungKelulusanList();
  }

  peruntukanDiambilModal(id?, id_tabung?, baki_jumlah_siling?) {
		const modalRef = this.modalService.open(PeruntukanDiambilComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
    modalRef.componentInstance.id_tabung = id_tabung;
    modalRef.componentInstance.id_tabung_kelulusan = id;
    modalRef.componentInstance.baki_jumlah_siling = baki_jumlah_siling;
	}

  deleteConfirmation(id?) {
		swalWarning.fire({
			title: 'Anda Pasti?',
			text: 'Adakah anda pasti ingin membuang maklumat kelulusan bayaran ini?',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			cancelButtonText: 'Tidak',
			confirmButtonText: 'Ya'
		}).then((result) => {
			if (result.value) {
        this._tabungKelulusanServiceProxy.delete(id).subscribe((response)=>{
          if(response.message == 'Kelulusan Sudah Mempunyai Pembayaran'){
            swalWarning.fire('Makluman', 'Kelulusan Sudah Mempunyai Pembayaran');
          }
          else{
            swalSuccess.fire('Berjaya!', 'Maklumat Kelulusan Bayaran Berjaya Dibuang');
            this.getTabungKelulusanList();
          }

        })
			}
		},(error)=>{
      swalError.fire('Amaran!',error.message);
    });
	}
}
