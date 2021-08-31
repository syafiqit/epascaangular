import { Component, Input, OnInit, ViewChild, } from '@angular/core';
import { PrimengTableHelper } from '@app/shared/helpers/PrimengTableHelper';
import { GetTabungBwiForEditDto, TabungBwiKirServiceProxy } from '@app/shared/proxy/service-proxies';
import { finalize } from 'rxjs/operators';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { TambahKetuaIsiRumahComponent } from '../../tambah-ketua-isi-rumah/tambah-ketua-isi-rumah.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tambah-edit-kir',
  templateUrl: './tambah-edit-kir.component.html'
})
export class TambahEditKirComponent implements OnInit {

  @Input() public idBwi: number;

  @ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

  primengTableHelper: PrimengTableHelper;

  edit: GetTabungBwiForEditDto = new GetTabungBwiForEditDto();

  filter: string;
  rows = [];

  constructor(
    private _tabungBwiKirServiceProxy: TabungBwiKirServiceProxy,
    private modalService: NgbModal,
  ) {
    this.primengTableHelper = new PrimengTableHelper();
   }

  ngOnInit(): void {
  }

  getKir(event?: LazyLoadEvent) {
    if (this.primengTableHelper.shouldResetPaging(event)) {
      this.paginator.changePage(0);
      return;
    }
    this.primengTableHelper.showLoadingIndicator();

    this._tabungBwiKirServiceProxy
    .getAllKirById(
      this.filter,
      this.idBwi,
      this.primengTableHelper.getSorting(this.dataTable),
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

  addKirModal(id_tabung_bwi) {
		const modalRef = this.modalService.open(TambahKetuaIsiRumahComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
    modalRef.componentInstance.kategori = 2;
    modalRef.componentInstance.id_tabung_bwi = id_tabung_bwi;
    modalRef.result.then(
			(response) => {
				if (response) {
          this.rows.push({ id: response.id, nama: response.nama, jumlah_bwi: response.jumlah_bwi, nama_daerah: response.nama_daerah, nama_negeri: response.nama_negeri });
          this.getKir();
				}
			},
			() => {}
		);
	}

}
