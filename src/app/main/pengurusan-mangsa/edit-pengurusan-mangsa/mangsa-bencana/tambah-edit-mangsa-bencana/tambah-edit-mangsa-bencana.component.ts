import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import {
  CreateOrEditMangsaBencanaDto,
  MangsaBencanaServiceProxy,
  OutputCreateMangsaBencanaDto,
  RefPindahServiceProxy
} from 'src/app/shared/proxy/service-proxies';
import { swalError, swalSuccess } from '@shared/sweet-alert/swal-constant';
import { SelectBencanaComponent } from '@app/main/pengurusan-mangsa/select-bencana/select-bencana.component';
import * as moment from 'moment';
@Component({
	selector: 'app-tambah-edit-mangsa-bencana',
	templateUrl: './tambah-edit-mangsa-bencana.component.html'
})

export class TambahEditMangsaBencanaComponent implements OnInit {
	@Input() name;
	@Input() id;
  @Input() id_negeri;

  addBencana: CreateOrEditMangsaBencanaDto = new CreateOrEditMangsaBencanaDto();
  output: OutputCreateMangsaBencanaDto = new OutputCreateMangsaBencanaDto();

  saving = false;
  idMangsa: number;
  evacuates: any;
  tarikhBencana: string;
  statusPindah:boolean;
  modelBencana: NgbDateStruct;
  readonly DELIMITER = '-';

	constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private _activatedRoute: ActivatedRoute,
    private _mangsaBencanaServiceProxy: MangsaBencanaServiceProxy,
    private _refPindahServiceProxy: RefPindahServiceProxy
  ) {
    this.idMangsa = this._activatedRoute.snapshot.queryParams['id'];
  }

	ngOnInit(): void {
    this.show();
    this.getPindah();
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
			this.addBencana = new CreateOrEditMangsaBencanaDto();
		} else {
			this._mangsaBencanaServiceProxy.getMangsaBencanaForEdit(this.id).subscribe((result) => {
				this.addBencana = result.mangsa_bencana;
        if(result.mangsa_bencana.tarikh_bencana){
          this.modelBencana = this.fromModel(result.mangsa_bencana.tarikh_bencana.format('YYYY-MM-DD'));
        }
			});
		}
	}

	getPindah(filter?) {
		this._refPindahServiceProxy.getRefPindahForDropdown(filter).subscribe((result) => {
			this.evacuates = result.items;
		});
	}

	pilihBencana() {
		const modalRef = this.modalService.open(SelectBencanaComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
    modalRef.componentInstance.id_negeri = this.id_negeri;
    modalRef.result.then(
			(response) => {
				if (response) {
          this.addBencana.id_bencana = response.id;
          this.addBencana.nama_bencana = response.nama_bencana;
          this.modelBencana = this.fromModel(response.tarikh_bencana.format('YYYY-MM-DD'));
				}
			}
		);
	}

  statusPindahValidate(id){
    if(id == 1){
      this.statusPindah = false;
    }
    else{
      this.statusPindah = true;
    }
  }

	save(): void {
		this.saving = true;
    this.addBencana.id_mangsa = this.idMangsa;
    if(this.modelBencana){
      this.tarikhBencana = this.toModel(this.modelBencana);
      this.addBencana.tarikh_bencana = moment(this.tarikhBencana, "YYYY-MM-DD");
    }
		this._mangsaBencanaServiceProxy
			.createOrEdit(this.addBencana)
			.pipe(
				finalize(() => {
					this.saving = false;
				})
			)
			.subscribe((result) => {
        this.output = result;
        if(this.output.message == "Pendaftaran Mangsa Bencana Berjaya Disimpan!"){
          swalSuccess.fire('Berjaya!', 'Maklumat Bencana Mangsa Berjaya Dihantar.', 'success').then(() => {
            this.activeModal.close(true);
          });
        }
        else if(this.output.message == "Mangsa Bencana Berjaya Di Kemaskini!"){
          swalSuccess.fire('Berjaya!', 'Maklumat Bencana Mangsa Berjaya Disimpan.', 'success').then(() => {
            this.activeModal.close(true);
          });
        }
        else{
          swalError.fire('Tidak Berjaya!', this.output.message, 'error');
        }
			});
	}

}
