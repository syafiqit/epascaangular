import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbCalendar, NgbDateStruct, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import {
  CreateOrEditMangsaBantuanDto,
  GetMangsaBantuanForEditDto,
  MangsaBantuanServiceProxy,
  RefAgensiServiceProxy,
  RefSumberDanaServiceProxy
} from 'src/app/shared/proxy/service-proxies';
import { swalSuccess } from '@shared/sweet-alert/swal-constant';
import { LookupBencanaComponent } from '../../lookup-bencana/lookup-bencana.component';

@Component({
  selector: 'app-tambah-edit-bantuan-lain',
  templateUrl: './tambah-edit-bantuan-lain.component.html',
  encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TambahEditBantuanLainComponent implements OnInit {

  @Input() name;
	@Input() id;
	@Input() idMangsa;

  bantuanLain: CreateOrEditMangsaBantuanDto = new CreateOrEditMangsaBantuanDto();
  editBantuanLain: GetMangsaBantuanForEditDto = new GetMangsaBantuanForEditDto();

	saving = true;
  agensi: any;
  sumberDana: any;
  tarikh_bantuan: string;

  date = new Date();
  model: NgbDateStruct;
  today = this.calendar.getToday();
  readonly DELIMITER = '-';
  nama_bencana: string;
  modelBencana: NgbDateStruct;

  status=[
    {id: 1, nama_status: "Tidak Aktif"},
    {id: 2, nama_status: "Aktif"}
  ]

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
		private _mangsaBantuanServiceProxy: MangsaBantuanServiceProxy,
    private _refAgensiServiceProxy: RefAgensiServiceProxy,
    private _refSumberDanaServiceProxy: RefSumberDanaServiceProxy,
    private calendar: NgbCalendar
  ) {
    this.editBantuanLain.mangsa_bantuan = new CreateOrEditMangsaBantuanDto();
  }

  ngOnInit(): void {
    this.show();
    this.getAgensi();
    this.getSumberDana();
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
      this.bantuanLain = new CreateOrEditMangsaBantuanDto();
    } else {
      this._mangsaBantuanServiceProxy.getMangsaBantuanForEdit(this.id).subscribe((result) => {
        this.bantuanLain = result.mangsa_bantuan;
        if(result.mangsa_bantuan.tarikh_bantuan){
          this.model = this.fromModel(result.mangsa_bantuan.tarikh_bantuan.format('YYYY-MM-DD'));
        }
      });
    }
  }

  getAgensi(filter?) {
    this._refAgensiServiceProxy.getRefAgensiForDropdown(filter).subscribe((result) => {
      this.agensi = result.items;
    });
  }

  getSumberDana(filter?) {
    this._refSumberDanaServiceProxy.getRefSumberDanaForDropdown(filter).subscribe((result) => {
      this.sumberDana = result.items;
    });
  }

  pilihBencana() {
    const modalRef = this.modalService.open(LookupBencanaComponent, { size: 'lg' });
    modalRef.componentInstance.name = 'add';
    modalRef.componentInstance.mangsaId = this.idMangsa;
    modalRef.result.then(
      (response) => {
        if (response) {
          this.bantuanLain.id_bencana = response.id_bencana;
          this.nama_bencana = response.nama_bencana;
          this.modelBencana = this.fromModel(response.tarikh_bencana.format('YYYY-MM-DD'));
        }
      }
    );
  }

  save() {
    this.saving = true;
    if(this.model){
      this.tarikh_bantuan = this.toModel(this.model);
      this.bantuanLain.tarikh_bantuan = moment(this.tarikh_bantuan, "YYYY-MM-DD");
    }
    this.bantuanLain.id_mangsa = this.idMangsa;
    this._mangsaBantuanServiceProxy
      .createOrEdit(this.bantuanLain)
      .pipe()
      .subscribe((result) => {
        if (this.name == 'add') {
          swalSuccess.fire('Berjaya!', 'Maklumat Bantuan Lain Berjaya Ditambah.', 'success');
        } else if (this.name == 'edit') {
          swalSuccess.fire('Berjaya!', 'Maklumat Bantuan Lain Berjaya Dikemaskini.', 'success');
        }
        this.activeModal.close(true);
      });
  }
}
