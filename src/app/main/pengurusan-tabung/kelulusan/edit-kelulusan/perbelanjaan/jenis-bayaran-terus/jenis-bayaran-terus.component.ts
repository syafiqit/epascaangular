import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PrimengTableHelper } from '@app/shared/helpers/PrimengTableHelper';
import { TabungKelulusanServiceProxy } from '@app/shared/proxy/service-proxies';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-jenis-bayaran-terus',
  templateUrl: './jenis-bayaran-terus.component.html'
})
export class JenisBayaranTerusComponent implements OnInit {

  @ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

  filterKelulusan:any;
  filterIdKelulusan:any;
  id:number;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _tabungKelulusanServiceProxy: TabungKelulusanServiceProxy
  ) {
    this.id = this._activatedRoute.snapshot.queryParams['id'];
    this.primengTableHelper = new PrimengTableHelper(); }

  ngOnInit(): void {
  }

  getBelanjaTerus(event?: LazyLoadEvent) {
		this.primengTableHelper.showLoadingIndicator();
		this._tabungKelulusanServiceProxy.getBayaranTerusByIdKelulusan(
      this.filterKelulusan,
      this.filterIdKelulusan = this.id,
      this.primengTableHelper.getSorting(this.dataTable),
      this.primengTableHelper.getSkipCount(this.paginator, event),
      this.primengTableHelper.getMaxResultCount(this.paginator, event))
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

}
