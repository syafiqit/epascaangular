import { Component, OnInit, ViewEncapsulation, Input, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { CreateOrEditTabungBwiKirDto, TabungBwiKirServiceProxy, TabungBwiServiceProxy } from 'src/app/shared/proxy/service-proxies';
declare let require;
const Swal = require('sweetalert2');
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

	@Input() name;
	@Input() id;
  @Input() kategori;
  @Input() id_tabung_bwi;

  kir: CreateOrEditTabungBwiKirDto = new CreateOrEditTabungBwiKirDto();
  idMangsa: number;
  filter: string;
  saving = false;

	constructor(
    config: NgbModalConfig,
    public activeModal: NgbActiveModal,
    private _tabungBwiServiceProxy: TabungBwiServiceProxy,
    private _tabungBwiKirServiceProxy: TabungBwiKirServiceProxy
  ) {
		config.backdrop = 'static';
		config.keyboard = false;
		this.primengTableHelper = new PrimengTableHelper();
	}

	ngOnInit(): void {}

	getDisaster(event?: LazyLoadEvent) {
		if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this._tabungBwiServiceProxy
			.getAllKir(
				this.filter,
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
            Swal.fire('Berjaya!', 'Maklumat Ketua Isi Rumah Berjaya Ditambah.', 'success');
          } else if (this.name == 'edit') {
            Swal.fire('Berjaya!', 'Maklumat Ketua Isi Rumah Berjaya Dikemaskini.', 'success');
          }
          this.activeModal.close(true);
        });
    }
  }
}
