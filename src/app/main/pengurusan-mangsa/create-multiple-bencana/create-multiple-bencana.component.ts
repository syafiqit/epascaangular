import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import {
  CreateOrEditMangsaBencanaDto,
  InputCreateMultipleMangsaBencanaDto,
  MangsaBencanaServiceProxy,
  RefPindahServiceProxy
} from 'src/app/shared/proxy/service-proxies';
import { swalSuccess, swalWarning } from '@shared/sweet-alert/swal-constant';
import { SelectBencanaComponent } from '@app/main/pengurusan-mangsa/select-bencana/select-bencana.component';
import * as moment from 'moment';

@Component({
  selector: 'app-create-multiple-bencana',
  templateUrl: './create-multiple-bencana.component.html'
})
export class CreateMultipleBencanaComponent implements OnInit {
	@Input() name;
	@Input() id;
  @Input() id_negeri;
	@Input() idMangsa;

  addBencana: InputCreateMultipleMangsaBencanaDto = new InputCreateMultipleMangsaBencanaDto();
  bencana: CreateOrEditMangsaBencanaDto = new CreateOrEditMangsaBencanaDto();

  saving = false;
  evacuates: any;
  tarikhBencana: string;
  statusPindah:boolean;
  bencanaList: any;
  modelBencana: NgbDateStruct;
  readonly DELIMITER = '-';

	constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private _mangsaBencanaServiceProxy: MangsaBencanaServiceProxy,
    private _refPindahServiceProxy: RefPindahServiceProxy
  ) {
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
			this.addBencana = new InputCreateMultipleMangsaBencanaDto();
		} else {
			this._mangsaBencanaServiceProxy.getMangsaBencanaForEdit(this.id).subscribe((result) => {
				this.addBencana.mangsaBencana = result.mangsa_bencana;
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

	getBencana(filter?) {
    const modalRef = this.modalService.open(SelectBencanaComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
    modalRef.componentInstance.id_negeri = this.id_negeri;
    modalRef.result.then(
			(response) => {
				if (response) {
          this.bencana.id_bencana = response.id;
          this.bencana.nama_bencana = response.nama_bencana;
          this.modelBencana = this.fromModel(response.tarikh_bencana.format('YYYY-MM-DD'));
				}
			}
		);
  }

  // getTarikhBencana(tarikh?){
  //   this.modelBencana = this.fromModel(tarikh.format('YYYY-MM-DD'));
  // }

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
      this.bencana.tarikh_bencana = moment(this.tarikhBencana, "YYYY-MM-DD");
    }

    this.addBencana.mangsaBencana = this.bencana;

		this._mangsaBencanaServiceProxy
			.multipleCreateMangsaBencana(this.addBencana)
			.pipe(
				finalize(() => {
					this.saving = false;
				})
			)
			.subscribe((response) => {
				if (response.message == 'Pendaftaran Mangsa Bencana Berjaya Disimpan!') {
					swalSuccess.fire('Berjaya!', 'Maklumat Bencana Berjaya Disimpan.', 'success');
				} else {
					swalWarning.fire('Makluman!', response.message);
				}
				this.activeModal.close(true);
			});
	}

}
