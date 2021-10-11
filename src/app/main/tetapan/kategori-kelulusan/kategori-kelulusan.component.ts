import { Component, OnInit, ViewChild } from '@angular/core';
import { PrimengTableHelper } from '@app/shared/helpers/PrimengTableHelper';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { TambahEditKategoriKelulusanComponent } from './tambah-edit-kategori-kelulusan/tambah-edit-kategori-kelulusan.component';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-kategori-kelulusan',
  templateUrl: './kategori-kelulusan.component.html'
})
export class KategoriKelulusanComponent implements OnInit {

  @ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;
	public isCollapsed = false;
  disasters: any;

  filterText: string;
  terms$ = new Subject<string>();

	rows = [
		{
      id:1, nama_kategori_kelulusan: 'Bwi', status: 1
		},
		{
      id:2, nama_kategori_kelulusan: 'Pengoperasian', status: 1
		}
	];

  constructor(
    config: NgbModalConfig,
		private modalService: NgbModal,
  ) {
    this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
  }

  ngOnInit(): void {
    this.terms$.pipe(
      debounceTime(500), distinctUntilChanged()
    ).subscribe((filterValue: string) =>{
      this.filterText = filterValue;
      this.getKategoriKelulusan();
    });
  }

  applyFilter(filterValue: string){
    this.terms$.next(filterValue);
  }

  getKategoriKelulusan(event?: LazyLoadEvent) {
		if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this.primengTableHelper.totalRecordsCount = this.rows.length;
		this.primengTableHelper.records = this.rows;
		this.primengTableHelper.hideLoadingIndicator();
	}

	reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}

	addKategoriKelulusanModal() {
		const modalRef = this.modalService.open(TambahEditKategoriKelulusanComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
		modalRef.result.then((response) => {
			if (response) {
				this.getKategoriKelulusan();
			}
		});
	}

	editKategoriKelulusanModal(id) {
		const modalRef = this.modalService.open(TambahEditKategoriKelulusanComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'edit';
		modalRef.componentInstance.id = id;
		modalRef.result.then((response) => {
			if (response) {
				this.getKategoriKelulusan();
			}
		});
	}

}
