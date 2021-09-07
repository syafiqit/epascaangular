import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbCalendar, NgbDateStruct, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import {
  CreateOrEditMangsaWangIhsanDto,
  GetMangsaWangIhsanForEditDto,
  MangsaWangIhsanServiceProxy,
  RefAgensiServiceProxy,
  RefBencanaServiceProxy
} from 'src/app/shared/proxy/service-proxies';
import * as moment from 'moment';
import { swalSuccess } from '@shared/sweet-alert/swal-constant';
import { DatePipe } from '@angular/common';

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
  agensi: any;
  agency: any;
  bencana: any;
  disaster: any;
  date = new Date();
  model: NgbDateStruct;
  today = this.calendar.getToday();
  tarikhSerahan: string;
  readonly DELIMITER = '-';
  date_bencana:any;
  pipe = new DatePipe('en-US');

  status=[
    {id: 1, nama_status: "Tidak Aktif"},
    {id: 2, nama_status: "Aktif"}
  ]

  constructor(
		public activeModal: NgbActiveModal,
		private _mangsaWangIhsanServiceProxy: MangsaWangIhsanServiceProxy,
    private _refAgensiServiceProxy: RefAgensiServiceProxy,
    private _refBencanaServiceProxy: RefBencanaServiceProxy,
    private calendar: NgbCalendar
    ) {
      this.editWangIhsan.mangsa_wang_ihsan = new CreateOrEditMangsaWangIhsanDto();
    }

    ngOnInit(): void {
      this.show();
      this.getBencana();
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

    show(filter?) {
      if (!this.id) {
        this.wangIhsan = new CreateOrEditMangsaWangIhsanDto();
      } else {
        this._mangsaWangIhsanServiceProxy.getMangsaWangIhsanForEdit(this.id).subscribe((result) => {
          this.wangIhsan = result.mangsa_wang_ihsan;
          if(result.mangsa_wang_ihsan.tarikh_serahan){
            this.model = this.fromModel(result.mangsa_wang_ihsan.tarikh_serahan.format('YYYY-MM-DD'));
          }
        });

        this._refBencanaServiceProxy.getRefBencanaForDropdown(filter).subscribe((result) => {
          this.date_bencana = result.items.filter(
            filt=>{
              if(filt.id == this.wangIhsan.id_bencana){
                return filt.tarikh_bencana;
              }
            }).map(data=>{
              return this.pipe.transform(data.tarikh_bencana.toDate(), 'dd/MM/yyyy');
            });
          });
      }
    }

    getAgensi(filter?) {
      this._refAgensiServiceProxy.getRefAgensiForDropdown(filter).subscribe((result) => {
        this.agency = result.items;
      });
    }

    getBencana(filter?) {
      this._refBencanaServiceProxy.getRefBencanaForDropdown(filter).subscribe((result) => {
        this.disaster = result.items;
      });
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

    onSelectBencana(id?,filter?){
      console.log(id);
      this._refBencanaServiceProxy.getRefBencanaForDropdown(filter).subscribe((result) => {
        this.date_bencana = result.items.filter(
          filt=>{
            if(filt.id == id){
              return filt.tarikh_bencana;
            }
          }).map(data=>{
            return this.pipe.transform(data.tarikh_bencana.toDate(), 'dd/MM/yyyy');
          });
        });
    }

}
