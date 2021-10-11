import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import {
  CreateOrEditRefRujukanDto,
  RefRujukanServiceProxy
} from "../../../../shared/proxy/service-proxies";
import { environment } from 'src/environments/environment';
import {HttpClient} from "@angular/common/http";
import {FormBuilder, FormGroup} from "@angular/forms";
import { ConfirmationService } from '@app/shared/services/confirmation';

@Component({
	selector: 'app-tambah-edit-rujukan',
	templateUrl: './tambah-edit-rujukan.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, RefRujukanServiceProxy]
})
export class TambahEditRujukanComponent implements OnInit {
  @Input() name;
  @Input() id;

  formGroup: FormGroup;
  files: File;
  rujukan: CreateOrEditRefRujukanDto = new CreateOrEditRefRujukanDto();
  saving = false;
  serverUrl = environment.apiUrl + '/api/refRujukan/uploadFail';
  response: any = {};
  hasData: number;

	modelFooter: NgbDateStruct;
	today = this.calendar.getToday();

	constructor(
    public activeModal: NgbActiveModal,
    private calendar: NgbCalendar,
    private _confirmationService: ConfirmationService,
    private _refRujukanServiceProxy: RefRujukanServiceProxy,
    private _formBuilder: FormBuilder,
    private httpClient: HttpClient,
    ) {}

	ngOnInit(): void {
    this.formGroup = this._formBuilder.group({
      file: ''
    });

    this.show();
  }

  show() {
    if (!this.id) {
      this.rujukan = new CreateOrEditRefRujukanDto();
    } else {
      this._refRujukanServiceProxy.getRefRujukanForEdit(this.id).subscribe((result) => {
        this.rujukan = result.ref_rujukan;
      });
    }
  }

  onSelect(event) {
    this.files = event.target.files[0];

    const file = this.files;
    this.formGroup.get('file').setValue(file);
    this.hasData = 1;
  }

  tambahRujukan() {
    const dialogRef = this._confirmationService.open({
      title: 'Berjaya',
      message: 'Maklumat Rujukan Berjaya Ditambah.',
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

  editRujukan() {
    const dialogRef = this._confirmationService.open({
      title: 'Berjaya',
      message: 'Maklumat Rujukan Berjaya Dikemaskini.',
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

  save(): void {
    this.saving = true;

    const formData = new FormData();

    if (this.files) {
      formData.append('fail', this.formGroup.get('file').value);

      this.httpClient.post<any>(this.serverUrl, formData).subscribe(
        (res) => {
          this.response = res;
          if(res.file_location){
            this.rujukan.lokasi_dokumen = res.file_location;
            this.rujukan.sambungan_fail = res.file_extension;
            this.rujukan.nama_dokumen = res.file_name;

            this._refRujukanServiceProxy
              .createOrEdit(this.rujukan)
              .pipe()
              .subscribe(() => {
                if (this.name == 'add') {
                  this.tambahRujukan();
                } else if (this.name == 'edit') {
                  this.editRujukan();
                }
              });
          }
        }
      );
    }
    else{
      this._refRujukanServiceProxy
        .createOrEdit(this.rujukan)
        .pipe()
        .subscribe(() => {
          if (this.name == 'add') {
            this.tambahRujukan();
          } else if (this.name == 'edit') {
            this.editRujukan();
          }
        });
    }
  }
}
