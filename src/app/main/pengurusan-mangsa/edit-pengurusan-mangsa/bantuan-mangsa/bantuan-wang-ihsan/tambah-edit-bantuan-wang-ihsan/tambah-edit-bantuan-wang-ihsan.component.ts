import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbCalendar, NgbDateStruct, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import {
  CreateOrEditMangsaWangIhsanDto,
  GetMangsaWangIhsanForEditDto,
  MangsaWangIhsanServiceProxy,
  RefAgensiServiceProxy,
  RefJenisBwiServiceProxy
} from 'src/app/shared/proxy/service-proxies';
import * as moment from 'moment';
import { swalSuccess } from '@shared/sweet-alert/swal-constant';
import { LookupBencanaComponent } from '../../lookup-bencana/lookup-bencana.component';

@Component({
  selector: 'app-tambah-edit-bantuan-wang-ihsan',
  templateUrl: './tambah-edit-bantuan-wang-ihsan.component.html',
  encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TambahEditBantuanWangIhsanComponent implements OnInit {

  @Input() name;
	@Input() id;
	@Input() idMangsa;

  wangIhsan: CreateOrEditMangsaWangIhsanDto = new CreateOrEditMangsaWangIhsanDto();
  editWangIhsan: GetMangsaWangIhsanForEditDto = new GetMangsaWangIhsanForEditDto();

	saving = true;
  types: any;
  agensi: any;
  agency: any;
  bencana: any;
  date = new Date();
  model: NgbDateStruct;
  modelBencana: NgbDateStruct;
  today = this.calendar.getToday();
  tarikhSerahan: string;
  readonly DELIMITER = '-';
  id_bencana: number;
  nama_bencana: string;

  status=[
    {id: 1, nama_status: "Tidak Aktif"},
    {id: 2, nama_status: "Aktif"}
  ]

  constructor(
    private modalService: NgbModal,
		public activeModal: NgbActiveModal,
		private _mangsaWangIhsanServiceProxy: MangsaWangIhsanServiceProxy,
    private _refAgensiServiceProxy: RefAgensiServiceProxy,
    private _refJenisBwiServiceProxy: RefJenisBwiServiceProxy,
    private calendar: NgbCalendar
    ) {
      this.editWangIhsan.mangsa_wang_ihsan = new CreateOrEditMangsaWangIhsanDto();
    }

    ngOnInit(): void {
      this.show();
      this.getJenisBwi();
      this.getAgensi();
    }

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

    show() {
      if (!this.id) {
        this.wangIhsan = new CreateOrEditMangsaWangIhsanDto();
      } else {
        this._mangsaWangIhsanServiceProxy.getMangsaWangIhsanForEdit(this.id).subscribe((result) => {
          this.wangIhsan = result.mangsa_wang_ihsan;
          if(result.mangsa_wang_ihsan.tarikh_serahan){
            this.model = this.fromModel(result.mangsa_wang_ihsan.tarikh_serahan.format('YYYY-MM-DD'));
          }
        });
      }
    }

    getJenisBwi(filter?) {
      this._refJenisBwiServiceProxy.getRefJenisBwiForDropdown(filter).subscribe((result) => {
        this.types = result.items;
      });
    }

    getAgensi(filter?) {
      this._refAgensiServiceProxy.getRefAgensiForDropdown(filter).subscribe((result) => {
        this.agency = result.items;
      });
    }

    pilihBencana() {
      const modalRef = this.modalService.open(LookupBencanaComponent, { size: 'lg' });
      modalRef.componentInstance.name = 'add';
      modalRef.componentInstance.mangsaId = this.idMangsa;
      modalRef.result.then(
        (response) => {
          if (response) {
            this.wangIhsan.id_bencana = response.id_bencana;
            this.nama_bencana = response.nama_bencana;
            this.modelBencana = this.fromModel(response.tarikh_bencana.format('YYYY-MM-DD'));
          }
        }
      );
    }

    save() {
      this.saving = true;
      this.wangIhsan.id_mangsa = this.idMangsa;
      if(this.model){
        this.tarikhSerahan = this.toModel(this.model);
        this.wangIhsan.tarikh_serahan = moment(this.tarikhSerahan, "YYYY-MM-DD");
      }
      this._mangsaWangIhsanServiceProxy
        .createOrEdit(this.wangIhsan)
        .pipe()
        .subscribe((result) => {
          if (this.name == 'add') {
            swalSuccess.fire('Berjaya!', 'Maklumat Bantuan Wang Ihsan Berjaya Ditambah.', 'success');
          } else if (this.name == 'edit') {
            swalSuccess.fire('Berjaya!', 'Maklumat Bantuan Wang Ihsan Berjaya Dikemaskini.', 'success');
          }
          this.activeModal.close(true);
        });
    }

}
