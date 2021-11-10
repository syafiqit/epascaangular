import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbCalendar, NgbDateStruct, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import {
  CreateOrEditMangsaPinjamanDto,
  GetMangsaPinjamanForEditDto,
  MangsaPinjamanServiceProxy,
  RefAgensiServiceProxy,
  RefSektorServiceProxy
} from 'src/app/shared/proxy/service-proxies';
import { LookupBencanaComponent } from '../../lookup-bencana/lookup-bencana.component';
import { ConfirmationService } from '@services/confirmation';
import { AppSessionService } from '@app/shared/services/app-session.service';

@Component({
  selector: 'app-tambah-edit-bantuan-pinjaman-khas',
  templateUrl: './tambah-edit-bantuan-pinjaman-khas.component.html',
  encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TambahEditBantuanPinjamanKhasComponent implements OnInit {

  @Input() name;
	@Input() id;
	@Input() idMangsa;

  pinjamanKhas: CreateOrEditMangsaPinjamanDto = new CreateOrEditMangsaPinjamanDto();
  editPinjamanKhas: GetMangsaPinjamanForEditDto = new GetMangsaPinjamanForEditDto();

	saving = true;
  agensi: any;
  sektor: any;

  date = new Date();
  model: NgbDateStruct;
  today = this.calendar.getToday();
  tarikhBencana: string;
  tarikh_mula: string;
  readonly DELIMITER = '-';
  modelBencana: NgbDateStruct;

  status=[
    {id: 1, nama_status: "Tidak Aktif"},
    {id: 2, nama_status: "Aktif"}
  ]

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
		private _mangsaPinjamanServiceProxy: MangsaPinjamanServiceProxy,
    private _refAgensiServiceProxy: RefAgensiServiceProxy,
    private _refSektorServiceProxy: RefSektorServiceProxy,
    private calendar: NgbCalendar,
    private _confirmationService: ConfirmationService,
    public _appSession: AppSessionService,
    ) {
      this.editPinjamanKhas.mangsa_pinjaman = new CreateOrEditMangsaPinjamanDto();
    }

  ngOnInit(): void {
    this.show();
    this.getAgensi();
    this.getSektor();
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
      this.pinjamanKhas = new CreateOrEditMangsaPinjamanDto();
    } else {
      this._mangsaPinjamanServiceProxy.getMangsaPinjamanForEdit(this.id).subscribe((result) => {
        this.pinjamanKhas = result.mangsa_pinjaman;
        if(result.mangsa_pinjaman.tarikh_bencana){
          this.modelBencana = this.fromModel(result.mangsa_pinjaman.tarikh_bencana.format('YYYY-MM-DD'));
        }
        if(result.mangsa_pinjaman.tarikh_mula){
          this.model = this.fromModel(result.mangsa_pinjaman.tarikh_mula.format('YYYY-MM-DD'));
        }
      });
    }
  }

  getAgensi(filter?) {
    this._refAgensiServiceProxy.getRefAgensiForDropdown(filter).subscribe((result) => {
      this.agensi = result.items;
    });
  }

  getSektor(filter?) {
    this._refSektorServiceProxy.getRefSektorForDropdown(filter).subscribe((result) => {
      this.sektor = result.items;
    });
  }

  pilihBencana() {
    const modalRef = this.modalService.open(LookupBencanaComponent, { size: 'lg' });
    modalRef.componentInstance.name = 'add';
    modalRef.componentInstance.mangsaId = this.idMangsa;
    modalRef.result.then(
      (response) => {
        if (response) {
          this.pinjamanKhas.id_bencana = response.id_bencana;
          this.pinjamanKhas.nama_bencana = response.nama_bencana;
          this.modelBencana = this.fromModel(response.tarikh_bencana.format('YYYY-MM-DD'));
        }
      }
    );
  }

  save() {
    this.saving = true;
    this.pinjamanKhas.id_mangsa = this.idMangsa;
    if(this.modelBencana){
      this.tarikhBencana = this.toModel(this.modelBencana);
      this.pinjamanKhas.tarikh_bencana = moment(this.tarikhBencana, "YYYY-MM-DD");
    }
    if(this.model){
      this.tarikh_mula = this.toModel(this.model);
      this.pinjamanKhas.tarikh_mula = moment(this.tarikh_mula, "YYYY-MM-DD");
    }
    this._mangsaPinjamanServiceProxy
      .createOrEdit(this.pinjamanKhas)
      .pipe()
      .subscribe((result) => {
        if (this.name == 'add') {
          const dialogRef = this._confirmationService.open({
            title: 'Berjaya',
            message: 'Maklumat Bantuan Pinjaman Khas Berjaya Ditambah.',
            icon: {
              show: true,
              name: 'check-circle',
              color: 'success'
            },
            actions: {
              confirm: {
                show: true,
                label: 'Tutup',
                color: 'primary'
              },
              cancel: {
                show: false
              }
            },
            dismissible: true
          });
          dialogRef.afterClosed().subscribe(() => {
            this.activeModal.close(true);
          });
        } else if (this.name == 'edit') {
          const dialogRef = this._confirmationService.open({
            title: 'Berjaya',
            message: 'Maklumat Bantuan Pinjaman Khas Berjaya Dikemaskini.',
            icon: {
              show: true,
              name: 'check-circle',
              color: 'success'
            },
            actions: {
              confirm: {
                show: true,
                label: 'Tutup',
                color: 'primary'
              },
              cancel: {
                show: false
              }
            },
            dismissible: true
          });
          dialogRef.afterClosed().subscribe(() => {
            this.activeModal.close(true);
          });
        }
      });
  }

}
