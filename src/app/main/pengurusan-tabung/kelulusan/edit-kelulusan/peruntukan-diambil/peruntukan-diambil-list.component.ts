import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PrimengTableHelper } from '@app/shared/helpers/PrimengTableHelper';
import { CreateOrEditTabungKelulusanDto, TabungKelulusanAmbilanServiceProxy, TabungKelulusanServiceProxy } from '@app/shared/proxy/service-proxies';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';
import { PeruntukanDiambilComponent } from '../../peruntukan-diambil/peruntukan-diambil.component';

@Component({
  selector: 'app-peruntukan-diambil-list',
  templateUrl: './peruntukan-diambil-list.component.html'
})
export class PeruntukanDiambilListComponent implements OnInit {

  @ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

  primengTableHelper: PrimengTableHelper;

  kelulusan: CreateOrEditTabungKelulusanDto = new CreateOrEditTabungKelulusanDto();
  id:number;
  filter:any;
  filterYear: number;
  filterIdKelulusan:any;
  year:string;
  arrayYear:any[];

  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private _tabungKelulusanServiceProxy: TabungKelulusanServiceProxy,
    private _tabungKelulusanAmbilanServiceProxy: TabungKelulusanAmbilanServiceProxy,
    private _activatedRoute: ActivatedRoute
  ) {
    this.id = this._activatedRoute.snapshot.queryParams['id'];
    this.primengTableHelper = new PrimengTableHelper();
    config.backdrop = 'static';
		config.keyboard = false;
  }

  ngOnInit(): void {
    this.show();
    this.generateArrayOfYears();
  }

  show() {
    if (!this.id) {
      this.kelulusan = new CreateOrEditTabungKelulusanDto();
    } else {
      this._tabungKelulusanServiceProxy.getTabungKelulusanForEdit(this.id).subscribe((result) => {
        this.kelulusan = result.tabung_kelulusan;
      });
    }
  }

  getPeruntukanDiambil(event?: LazyLoadEvent) {
		this.primengTableHelper.showLoadingIndicator();
		this._tabungKelulusanAmbilanServiceProxy
			.getAll(
				this.filter,
        this.filterYear,
        this.filterIdKelulusan = this.id ?? undefined,
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

  peruntukanDiambilModal(id?, id_tabung?, baki_jumlah_siling?) {
		const modalRef = this.modalService.open(PeruntukanDiambilComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
    modalRef.componentInstance.id_tabung = id_tabung;
    modalRef.componentInstance.id_tabung_kelulusan = id;
    modalRef.componentInstance.baki_jumlah_siling = baki_jumlah_siling;
    modalRef.result.then(
			(response) => {
				if (response) {
          this.getPeruntukanDiambil();
				}
			}
		);
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

}
