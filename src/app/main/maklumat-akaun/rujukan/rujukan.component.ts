import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { PrimengTableHelper } from '@app/shared/helpers/PrimengTableHelper';
import { RefRujukanServiceProxy } from '@app/shared/proxy/service-proxies';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';
@Component({
	selector: 'app-rujukan',
	templateUrl: './rujukan.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [RefRujukanServiceProxy]
})
export class RujukanComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;
  defaultImageUrl = '/assets/images/other-images/pdf-symbol.png';
  filter: string;
  filterStatus: number = 1;
  sorting: string;
  skipCount: number;
  maxResultCount: number;

	constructor(
    private _refRujukanServiceProxy: RefRujukanServiceProxy
  ) {
		this.primengTableHelper = new PrimengTableHelper();
  }

	ngOnInit(): void {
    this.getRujukan();
  }

	getRujukan(event?: LazyLoadEvent) {
    this.primengTableHelper.showLoadingIndicator();
    this._refRujukanServiceProxy
      .getAll(this.filter, this.filterStatus, this.sorting, this.skipCount, this.maxResultCount)
      .pipe(finalize(()=>{
        this.primengTableHelper.hideLoadingIndicator();
      }))
      .subscribe((result) => {
        this.primengTableHelper.totalRecordsCount = result.total_count;
        this.primengTableHelper.records = result.items;
      });
	}

  getFile(location){
    window.open(location);
  }
}
