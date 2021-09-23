import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PrimengTableHelper } from '@app/shared/helpers/PrimengTableHelper';
import { TabungKelulusanServiceProxy } from '@app/shared/proxy/service-proxies';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-kategori-skb',
  templateUrl: './kategori-skb.component.html'
})
export class KategoriSkbComponent implements OnInit {
  @ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;


  primengTableHelper: PrimengTableHelper;
  id:number;

  constructor(
    private _tabungKelulusanServiceProxy: TabungKelulusanServiceProxy,
    private _activatedRoute: ActivatedRoute
  ) { 
    this.id = this._activatedRoute.snapshot.queryParams['id'];
    this.primengTableHelper = new PrimengTableHelper();
  }

  ngOnInit(): void {
  }

  getBelanjaTabungSkb(event?: LazyLoadEvent) {

    if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this._tabungKelulusanServiceProxy.getKategoriTabungSkbByKelulusan(this.id)
      .pipe(finalize(()=> {
        this.primengTableHelper.hideLoadingIndicator();
      }))
			.subscribe((result) => {
				this.primengTableHelper.totalRecordsCount = result.total_count;
				this.primengTableHelper.records = result.items;
			});
	}

}
