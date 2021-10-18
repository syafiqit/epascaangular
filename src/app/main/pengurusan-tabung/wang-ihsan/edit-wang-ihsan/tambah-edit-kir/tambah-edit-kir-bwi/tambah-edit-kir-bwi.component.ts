import { Component, OnInit, ViewEncapsulation, Input, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { RefDaerahServiceProxy, RefNegeriServiceProxy, TabungBwiServiceProxy } from 'src/app/shared/proxy/service-proxies';

@Component({
  selector: 'app-tambah-edit-kir-bwi',
  templateUrl: './tambah-edit-kir-bwi.component.html',
  encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class TambahEditKirBwiComponent implements OnInit {
  @ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;
	public isCollapsed = false;

	@Input() name;
	@Input() id;
  @Input() kategori;
  @Input() id_tabung_bwi;

  idMangsa: number;
  terms$ = new Subject<string>();
  filter: string;
  filterDaerah: number;
  filterNegeri: number;
  districts: any;
  states: any;
  saving = false;

	constructor(
    config: NgbModalConfig,
    public activeModal: NgbActiveModal,
    private _refDaerahServiceProxy: RefDaerahServiceProxy,
    private _refNegeriSeviceProxy: RefNegeriServiceProxy
  ) {
		config.backdrop = 'static';
		config.keyboard = false;
		this.primengTableHelper = new PrimengTableHelper();
	}

	ngOnInit(): void {
    this.getDaerah();
    this.getNegeri();

    this.terms$.pipe(
      debounceTime(500), distinctUntilChanged()
    ).subscribe((filterValue: string) =>{
      this.filter = filterValue;
      this.getKirBwi();
    });
  }

  applyFilter(filterValue: string){
    this.terms$.next(filterValue);
  }

	getKirBwi(event?: LazyLoadEvent) {
		this.primengTableHelper.showLoadingIndicator();
	}

  getDaerah(filter?) {
		this._refDaerahServiceProxy.getRefDaerahForDropdown(filter, this.filterNegeri ?? undefined).subscribe((result) => {
			this.districts = result.items;
		});
	}

  getNegeri(filter?) {
		this._refNegeriSeviceProxy.getRefNegeriForDropdown(filter).subscribe((result) => {
			this.states = result.items;
		});
	}

  resetFilter() {
    this.filter = undefined;
    this.filterNegeri = undefined;
    this.filterDaerah = undefined;
    this.getKirBwi();
  }
}

