import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbCalendar, NgbDateStruct, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import {
  CreateOrEditMangsaPertanianDto,
  GetMangsaPertanianForEditDto,
  MangsaPertanianServiceProxy,
  RefAgensiServiceProxy,
  RefJenisPertanianServiceProxy
} from 'src/app/shared/proxy/service-proxies';
import { swalSuccess } from '@shared/sweet-alert/swal-constant';
import { LookupBencanaComponent } from '../../lookup-bencana/lookup-bencana.component';

@Component({
  selector: 'app-tambah-edit-bantuan-pertanian',
  templateUrl: './tambah-edit-bantuan-pertanian.component.html',
  encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TambahEditBantuanPertanianComponent implements OnInit {

  @Input() name;
	@Input() id;
	@Input() idMangsa;

  bantuanPertanian: CreateOrEditMangsaPertanianDto = new CreateOrEditMangsaPertanianDto();
  editBantuanPertanian: GetMangsaPertanianForEditDto= new GetMangsaPertanianForEditDto();

	saving = true;
  agensi: any;
  jenisPertanian: any;
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
		private _mangsaPertanianServiceProxy: MangsaPertanianServiceProxy,
    private _refAgensiServiceProxy: RefAgensiServiceProxy,
    private _refJenisPertanianServiceProxy: RefJenisPertanianServiceProxy,
    private calendar: NgbCalendar
    ) {
      this.editBantuanPertanian.mangsa_pertanian = new CreateOrEditMangsaPertanianDto();
    }

  ngOnInit(): void {
    this.show();
    this.getAgensi();
    this.getJenisPertanian();
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
      this.bantuanPertanian = new CreateOrEditMangsaPertanianDto();
    } else {
      this._mangsaPertanianServiceProxy.getMangsaPertanianForEdit(this.id).subscribe((result) => {
        this.bantuanPertanian = result.mangsa_pertanian;
        if(result.mangsa_pertanian.tarikh_bantuan){
          this.model = this.fromModel(result.mangsa_pertanian.tarikh_bantuan.format('YYYY-MM-DD'));
        }
      });
    }
  }

  getAgensi(filter?) {
    this._refAgensiServiceProxy.getRefAgensiForDropdown(filter).subscribe((result) => {
      this.agensi = result.items;
    });
  }

  getJenisPertanian(filter?) {
    this._refJenisPertanianServiceProxy.getRefJenisPertanianForDropdown(filter).subscribe((result) => {
      this.jenisPertanian = result.items;
    });
  }

  pilihBencana() {
    const modalRef = this.modalService.open(LookupBencanaComponent, { size: 'lg' });
    modalRef.componentInstance.name = 'add';
    modalRef.componentInstance.mangsaId = this.idMangsa;
    modalRef.result.then(
      (response) => {
        if (response) {
          this.bantuanPertanian.id_bencana = response.id_bencana;
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
      this.bantuanPertanian.tarikh_bantuan = moment(this.tarikh_bantuan, "YYYY-MM-DD");
    }
    this.bantuanPertanian.id_mangsa = this.idMangsa;
    this._mangsaPertanianServiceProxy
      .createOrEdit(this.bantuanPertanian)
      .pipe()
      .subscribe((result) => {
        if (this.name == 'add') {
          swalSuccess.fire('Berjaya!', 'Maklumat Bantuan Pertanian Berjaya Ditambah.', 'success');
        } else if (this.name == 'edit') {
          swalSuccess.fire('Berjaya!', 'Maklumat Bantuan Pertanian Berjaya Dikemaskini.', 'success');
        }
        this.activeModal.close(true);
      });
  }
}
