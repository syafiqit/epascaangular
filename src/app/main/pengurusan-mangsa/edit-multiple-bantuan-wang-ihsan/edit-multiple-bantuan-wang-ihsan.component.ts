import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbCalendar, NgbDateStruct, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import {
  CreateMultipleMangsaWangIhsanDto,
  InputCreateMultipleWangIhsanDto,
  MangsaWangIhsanServiceProxy,
  RefAgensiServiceProxy,
  RefBencanaServiceProxy,
  RefJenisBwiServiceProxy,
  RefKadarBwiServiceProxy
} from 'src/app/shared/proxy/service-proxies';
import * as moment from 'moment';
import { swalSuccess } from '@shared/sweet-alert/swal-constant';

@Component({
  selector: 'app-edit-multiple-bantuan-wang-ihsan',
  templateUrl: './edit-multiple-bantuan-wang-ihsan.component.html',
  encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal, RefKadarBwiServiceProxy]
})
export class EditMultipleBantuanWangIhsanComponent implements OnInit {


  @Input() name;
	@Input() id;
	@Input() idMangsa;

	saving = true;
  types: any;
  agensi: any;
  agency: any;
  jumlahBwi: any;
  bencana: any;
  bencanaList: any;
  date = new Date();
  model: NgbDateStruct;
  modelBencana: NgbDateStruct;
  today = this.calendar.getToday();
  tarikhSerahan: string;
  tarikhBencana: string;
  mangsaBwi: InputCreateMultipleWangIhsanDto = new InputCreateMultipleWangIhsanDto();
  wangIhsan: CreateMultipleMangsaWangIhsanDto = new CreateMultipleMangsaWangIhsanDto();
  readonly DELIMITER = '-';

  status=[
    {id: 1, nama_status: "Belum Dibayar"},
    {id: 2, nama_status: "Dibayar"},
    {id: 3, nama_status: "Dipulangkan"}
  ]

  constructor(
		public activeModal: NgbActiveModal,
    private _refAgensiServiceProxy: RefAgensiServiceProxy,
    private _refBencanaServiceProxy: RefBencanaServiceProxy,
    private _refJenisBwiServiceProxy: RefJenisBwiServiceProxy,
    private _refKadarBwiServiceProxy: RefKadarBwiServiceProxy,
    private _mangsaWangIhsanServiceProxy: MangsaWangIhsanServiceProxy,
    private calendar: NgbCalendar
    ) {
    }

    ngOnInit(): void {
      this.getJenisBwi();
      this.getAgensi();
      this.getJumlahBwi();
      this.getBencana();
      console.log(this.idMangsa);
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

    getJumlahBwi(filter?){
      this._refKadarBwiServiceProxy.getRefKadarBwiForDropdown(filter).subscribe((result) => {
        this.jumlahBwi = result.items;
      });
    }

    getBencana(filter?) {
      this._refBencanaServiceProxy.getRefBencanaForDropdown(filter).subscribe((result) => {
        this.bencanaList = result.items;
      });
    }

    getTarikhBencana(tarikh?){
      this.modelBencana = this.fromModel(tarikh.format('YYYY-MM-DD'));
    }

    save() {
      this.saving = true;
      if(this.model){
        this.tarikhSerahan = this.toModel(this.model);
        this.wangIhsan.tarikh_serahan = moment(this.tarikhSerahan, "YYYY-MM-DD");
      }
      this.mangsaBwi.id_mangsa = this.idMangsa;
      this.mangsaBwi.mangsaBwi = this.wangIhsan;

      this._mangsaWangIhsanServiceProxy
        .multipleCreateMangsaBwi(this.mangsaBwi)
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
