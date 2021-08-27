import { Component, OnInit, ViewEncapsulation, Input, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { CreateOrEditTabungBwiKirDto, RefDaerahServiceProxy, RefNegeriServiceProxy, TabungBwiKirServiceProxy, TabungBwiServiceProxy } from 'src/app/shared/proxy/service-proxies';
import { swalSuccess } from '@shared/sweet-alert/swal-constant';
@Component({
	selector: 'app-tambah-ketua-isi-rumah',
	templateUrl: './tambah-ketua-isi-rumah.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class TambahKetuaIsiRumahComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;
	public isCollapsed = false;

	@Input() name;
	@Input() id;
  @Input() kategori;
  @Input() id_tabung_bwi;

  kir: CreateOrEditTabungBwiKirDto = new CreateOrEditTabungBwiKirDto();
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
    private _tabungBwiServiceProxy: TabungBwiServiceProxy,
    private _tabungBwiKirServiceProxy: TabungBwiKirServiceProxy,
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
    if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this._tabungBwiServiceProxy
			.getAllKir(
				this.filter,
        this.filterDaerah ?? undefined,
        this.filterNegeri ?? undefined,
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

  select(id, nama, nama_daerah, nama_negeri, jumlah_bwi) {
    if (this.kategori == 1) {
      this.activeModal.close({
        id: id,
        nama: nama,
        nama_daerah: nama_daerah,
        nama_negeri: nama_negeri,
        jumlah_bwi: jumlah_bwi
      });
    }
    else {
      this.saving = true;

      this.kir.id_tabung_bwi = this.id_tabung_bwi;
      this.kir.id_mangsa = id;
      this._tabungBwiKirServiceProxy
        .createOrEdit(this.kir)
        .pipe()
        .subscribe(() => {
          if (this.name == 'add') {
            swalSuccess.fire('Berjaya!', 'Maklumat Ketua Isi Rumah Berjaya Ditambah.', 'success');
          } else if (this.name == 'edit') {
            swalSuccess.fire('Berjaya!', 'Maklumat Ketua Isi Rumah Berjaya Dikemaskini.', 'success');
          }
          this.activeModal.close(true);
        });
    }
  }
}
