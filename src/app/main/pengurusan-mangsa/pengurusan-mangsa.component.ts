import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { LazyLoadEvent } from 'primeng/api';
import {
  MangsaServiceProxy,
  RefAgensiServiceProxy,
  RefBencanaServiceProxy,
  RefDaerahServiceProxy,
  RefDunServiceProxy,
  RefNegeriServiceProxy,
  RefParlimenServiceProxy
} from 'src/app/shared/proxy/service-proxies';
import { finalize } from 'rxjs/operators';
import { NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
declare let require;
const Swal = require('sweetalert2');

@Component({
	selector: 'app-pengurusan-mangsa',
	templateUrl: './pengurusan-mangsa.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class PengurusanMangsaComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

	filter: string;
  filterNegeri: string;
  filterAgensi: string;
  filterDaerah: number;
  filterDun: number;
  filterParlimen: number;
  filterBencana: number;

	public isCollapsed = false;
  dun: any;
  parliaments: any;
  districts: any;
  states: any;
  disasters: any;
  agencies: any;

	items = [{ data: 'Nama' }, { data: 'No Kad Pengenalan' }];

	constructor(
		config: NgbModalConfig,
    private _mangsaServiceProxy: MangsaServiceProxy,
    private _refBencanaServiceProxy: RefBencanaServiceProxy,
    private _refAgensiServiceProxy: RefAgensiServiceProxy,
    private _refDunServiceProxy: RefDunServiceProxy,
    private _refParlimenServiceProxy: RefParlimenServiceProxy,
    private _refDaerahServiceProxy: RefDaerahServiceProxy,
    private _refNegeriServiceProxy: RefNegeriServiceProxy
  ) {
		this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
    this.getDun();
    this.getParlimen();
    this.getDaerah();
    this.getNegeri();
    this.getBencana();
    this.getAgensi();
  }

	getVictim(event?: LazyLoadEvent) {
		if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this._mangsaServiceProxy
			.getAll(
				this.filter,
				this.primengTableHelper.getSorting(this.dataTable),
        this.filterNegeri,
        this.filterAgensi,
        this.filterDaerah,
        this.filterDun,
        this.filterParlimen,
        this.filterBencana,
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

  getDun(filter?) {
		this._refDunServiceProxy.getRefDunForDropdown(filter).subscribe((result) => {
			this.dun = result.items;
		});
	}

  getParlimen(filter?) {
		this._refParlimenServiceProxy.getRefParlimenForDropdown(filter).subscribe((result) => {
			this.parliaments = result.items;
		});
	}

  getDaerah(filter?) {
		this._refDaerahServiceProxy.getRefDaerahForDropdown(filter).subscribe((result) => {
			this.districts = result.items;
		});
	}

  getNegeri(filter?) {
		this._refNegeriServiceProxy.getRefNegeriForDropdown(filter).subscribe((result) => {
			this.states = result.items;
		});
	}

  getBencana(filter?) {
		this._refBencanaServiceProxy.getRefBencanaForDropdown(filter).subscribe((result) => {
			this.disasters = result.items;
		});
	}

  getAgensi(filter?) {
		this._refAgensiServiceProxy.getRefAgensiForDropdown(filter).subscribe((result) => {
			this.agencies = result.items;
		});
	}

	reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}

	delete() {
		Swal.fire('Berjaya!', 'Barangan Berjaya Dibuang.', 'success');
	}
}
