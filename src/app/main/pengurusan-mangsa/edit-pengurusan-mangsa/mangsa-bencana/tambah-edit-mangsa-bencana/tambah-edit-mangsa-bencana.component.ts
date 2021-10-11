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
import { SelectBencanaComponent } from '@app/main/pengurusan-mangsa/select-bencana/select-bencana.component';
import * as moment from 'moment';
import { ConfirmationService } from '@services/confirmation';
import { fadeVerticalAnimation } from '@app/shared/data/router-animation/fade-vertical-animation';

@Component({
	selector: 'app-tambah-edit-mangsa-bencana',
	templateUrl: './tambah-edit-mangsa-bencana.component.html',
  animations: [fadeVerticalAnimation]
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
  modelBencana: NgbDateStruct;
  readonly DELIMITER = '-';

	constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private _activatedRoute: ActivatedRoute,
    private _mangsaBencanaServiceProxy: MangsaBencanaServiceProxy,
    private _refPindahServiceProxy: RefPindahServiceProxy,
    private _confirmationService: ConfirmationService
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
          const dialogRef = this._confirmationService.open({
            title: 'Berjaya',
            message: 'Pendaftaran Mangsa Bencana Berjaya Ditambah.',
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
        else if(this.output.message == "Mangsa Bencana Berjaya Di Kemaskini!"){
          const dialogRef = this._confirmationService.open({
            title: 'Berjaya',
            message: 'Maklumat Mangsa Bencana Berjaya Di Kemaskini.',
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
        else{
          const dialogRef = this._confirmationService.open({
            title: 'Perhatian',
            message: result.message,
            icon: {
              show: true,
              name: 'x-circle',
              color: 'error'
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
