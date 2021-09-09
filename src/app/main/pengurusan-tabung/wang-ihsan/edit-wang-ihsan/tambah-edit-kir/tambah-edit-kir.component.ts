import { Component, Input, OnInit, ViewChild, ViewEncapsulation, } from '@angular/core';
import { PrimengTableHelper } from '@app/shared/helpers/PrimengTableHelper';
import { CreateOrEditTabungBwiDto, GetTabungBwiForEditDto } from '@app/shared/proxy/service-proxies';
import { finalize } from 'rxjs/operators';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { TambahKetuaIsiRumahComponent } from '../../tambah-ketua-isi-rumah/tambah-ketua-isi-rumah.component';
import { NgbActiveModal, NgbCalendar, NgbDateStruct, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tambah-edit-kir',
  templateUrl: './tambah-edit-kir.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal, NgbActiveModal]
})
export class TambahEditKirComponent implements OnInit {

  @Input() public idBwi: number;

  @ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

  primengTableHelper: PrimengTableHelper;

  edit: GetTabungBwiForEditDto = new GetTabungBwiForEditDto();

  filter: string;
  rows = [];

  tarikhEft: string;
  tarikhAkuanKp: string;
  tarikhPenyaluran: string;
  tarikhLaporan: string;
  tarikhMaklum: string;
  tarikhMajlis: string;

  date = new Date();
  modelDueReport: NgbDateStruct;
  modelEft: NgbDateStruct;
  modelPerakuan: NgbDateStruct;
  modelPenyaluran: NgbDateStruct;
  modelLaporan: NgbDateStruct;
  modelMakluman: NgbDateStruct;
  modelMajlis: NgbDateStruct;
  modelSuratLaporan: NgbDateStruct;
  today = this.calendar.getToday();
  readonly DELIMITER = '-';

  constructor(
    config: NgbModalConfig,
    private calendar: NgbCalendar,
    private modalService: NgbModal,
  ) {
    this.primengTableHelper = new PrimengTableHelper();
    this.edit.tabung_bwi = new CreateOrEditTabungBwiDto();
		config.backdrop = 'static';
		config.keyboard = false;
   }

  ngOnInit(): void {}

  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      let date = value.split(this.DELIMITER);
      return {
        year : parseInt(date[0], 10),
        month : parseInt(date[1], 10),
        day : parseInt(date[2], 10)
      };
    }
    return null;
  }

  toModel(date: NgbDateStruct | null): string | null {
    return date ? date.year + this.DELIMITER + date.month + this.DELIMITER + date.day : null;
  }

  getKir(event?: LazyLoadEvent) {
    if (this.primengTableHelper.shouldResetPaging(event)) {
      this.paginator.changePage(0);
      return;
    }
    this.primengTableHelper.showLoadingIndicator();

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
