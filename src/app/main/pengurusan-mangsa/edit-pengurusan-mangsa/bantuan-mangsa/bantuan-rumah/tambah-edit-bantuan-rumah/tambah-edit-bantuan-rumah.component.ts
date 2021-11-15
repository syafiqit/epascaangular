import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbCalendar, NgbDateStruct, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import {
  CreateOrEditMangsaRumahDto,
  GetMangsaRumahForEditDto,
  MangsaRumahServiceProxy,
  RefBantuanServiceProxy,
  RefKerosakanServiceProxy,
  RefPelaksanaServiceProxy,
  RefPemilikServiceProxy,
  RefStatusKemajuanServiceProxy,
  RefSumberDanaServiceProxy,
  RefTapakRumahServiceProxy
} from 'src/app/shared/proxy/service-proxies';
import { LookupBencanaComponent } from '../../lookup-bencana/lookup-bencana.component';
import { ConfirmationService } from '@services/confirmation';
import { AppSessionService } from '@app/shared/services/app-session.service';

@Component({
  selector: 'app-tambah-edit-bantuan-rumah',
  templateUrl: './tambah-edit-bantuan-rumah.component.html',
  encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TambahEditBantuanRumahComponent implements OnInit {

  @Input() name;
	@Input() id;
	@Input() idMangsa;

  bantuanRumah: CreateOrEditMangsaRumahDto = new CreateOrEditMangsaRumahDto();
  editBantuanRumah: GetMangsaRumahForEditDto= new GetMangsaRumahForEditDto();

	saving = true;
  pemilik: any;
  jenisBantuan: any;
  kerosakan: any;
  tapakRumah: any;
  sumberDana: any;
  pelaksana: any;
  statusKemajuan: any;
  date = new Date();
  modelMula: NgbDateStruct;
  modelSiap: NgbDateStruct;
  today = this.calendar.getToday();
  tarikhBencana: string;
  tarikh_mula: string;
  tarikh_siap: string;
  readonly DELIMITER = '-';
  modelBencana: NgbDateStruct;

  status=[
    {id: 1, nama_status: "Tidak Aktif"},
    {id: 2, nama_status: "Aktif"}
  ]

	constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
		private _mangsaRumahServiceProxy: MangsaRumahServiceProxy,
    private _refPemilikServiceProxy: RefPemilikServiceProxy,
    private _refBantuanServiceProxy: RefBantuanServiceProxy,
    private _refKerosakanServiceProxy: RefKerosakanServiceProxy,
    private _refTapakRumahServiceProxy: RefTapakRumahServiceProxy,
    private _refSumberDanaServiceProxy: RefSumberDanaServiceProxy,
    private _refPelaksanaServiceProxy: RefPelaksanaServiceProxy,
    private _refStatusKemajuanServiceProxy: RefStatusKemajuanServiceProxy,
    private calendar: NgbCalendar,
    private _confirmationService: ConfirmationService,
    public _appSession: AppSessionService,
    ) {
    this.editBantuanRumah.mangsa_rumah = new CreateOrEditMangsaRumahDto();
	}

  ngOnInit(): void {
    this.show();
    this.getPemilik();
    this.getJenisBantuan();
    this.getKerosakan();
    this.getTapakRumah();
    this.getSumberDana();
    this.getPelaksana();
    this.getStatusKemajuan();
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
      this.bantuanRumah = new CreateOrEditMangsaRumahDto();
    } else {
      this._mangsaRumahServiceProxy.getMangsaRumahForEdit(this.id).subscribe((result) => {
        this.bantuanRumah = result.mangsa_rumah;
        if(result.mangsa_rumah.tarikh_bencana){
          this.modelBencana = this.fromModel(result.mangsa_rumah.tarikh_bencana.format('YYYY-MM-DD'));
        }
        if(result.mangsa_rumah.tarikh_mula){
          this.modelMula = this.fromModel(result.mangsa_rumah.tarikh_mula.format('YYYY-MM-DD'));
        }
        if(result.mangsa_rumah.tarikh_siap){
          this.modelSiap = this.fromModel(result.mangsa_rumah.tarikh_siap.format('YYYY-MM-DD'));
        }
      });
    }
  }

  getPemilik(filter?) {
    this._refPemilikServiceProxy.getRefPemilikForDropdown(filter).subscribe((result) => {
      this.pemilik = result.items;
    });
  }

  getJenisBantuan(filter?) {
    this._refBantuanServiceProxy.getRefBantuanForDropdown(filter).subscribe((result) => {
      this.jenisBantuan = result.items;
    });
  }

  getKerosakan(filter?) {
    this._refKerosakanServiceProxy.getRefKerosakanForDropdown(filter).subscribe((result) => {
      this.kerosakan = result.items;
    });
  }

  getTapakRumah(filter?) {
    this._refTapakRumahServiceProxy.getRefTapakRumahForDropdown(filter).subscribe((result) => {
      this.tapakRumah = result.items;
    });
  }

  getSumberDana(filter?) {
    this._refSumberDanaServiceProxy.getRefSumberDanaForDropdown(filter).subscribe((result) => {
      this.sumberDana = result.items;
    });
  }

  getPelaksana(filter?) {
    this._refPelaksanaServiceProxy.getRefPelaksanaForDropdown(filter).subscribe((result) => {
      this.pelaksana = result.items;
    });
  }

  getStatusKemajuan(filter?) {
    this._refStatusKemajuanServiceProxy.getRefStatusKemajuanForDropdown(filter).subscribe((result) => {
      this.statusKemajuan = result.items;
    });
  }

  pilihBencana() {
    const modalRef = this.modalService.open(LookupBencanaComponent, { size: 'lg' });
    modalRef.componentInstance.name = 'add';
    modalRef.componentInstance.mangsaId = this.idMangsa;
    modalRef.result.then(
      (response) => {
        if (response) {
          this.bantuanRumah.id_bencana = response.id_bencana;
          this.bantuanRumah.nama_bencana = response.nama_bencana;
          this.modelBencana = this.fromModel(response.tarikh_bencana.format('YYYY-MM-DD'));
        }
      }
    );
  }

  save() {
    this.saving = true;
    if(this.modelBencana){
      this.tarikhBencana = this.toModel(this.modelBencana);
      this.bantuanRumah.tarikh_bencana = moment(this.tarikhBencana, "YYYY-MM-DD");
    }
    if(this.modelMula){
      this.tarikh_mula = this.toModel(this.modelMula);
      this.bantuanRumah.tarikh_mula = moment(this.tarikh_mula, "YYYY-MM-DD");
    }
    if(this.modelSiap){
      this.tarikh_siap = this.toModel(this.modelSiap);
      this.bantuanRumah.tarikh_siap = moment(this.tarikh_siap, "YYYY-MM-DD");
    }
    this.bantuanRumah.id_mangsa = this.idMangsa;
    this._mangsaRumahServiceProxy
      .createOrEdit(this.bantuanRumah)
      .pipe()
      .subscribe((result) => {
        if (this.name == 'add') {
          const dialogRef = this._confirmationService.open({
            title: 'Berjaya',
            message: 'Maklumat Bantuan Rumah Berjaya Ditambah',
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
            message: 'Maklumat Bantuan Rumah Berjaya Dikemaskini',
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
