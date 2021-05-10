import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import {
  CreateOrEditRefRujukanDto,
  RefRujukanServiceProxy
} from "../../../../shared/proxy/service-proxies";
import { environment } from 'src/environments/environment';
import {HttpClient} from "@angular/common/http";
import {FormBuilder, FormGroup} from "@angular/forms";
declare let require;
const Swal = require('sweetalert2');

@Component({
	selector: 'app-tambah-edit-rujukan',
	templateUrl: './tambah-edit-rujukan.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal, RefRujukanServiceProxy]
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
	  private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private calendar: NgbCalendar,
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
                  Swal.fire('Berjaya!', 'Maklumat Rujukan Berjaya Ditambah.', 'success');
                } else if (this.name == 'edit') {
                  Swal.fire('Berjaya!', 'Maklumat Rujukan Berjaya Dikemaskini.', 'success');
                }
                this.activeModal.close(true);
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
            Swal.fire('Berjaya!', 'Maklumat Rujukan Berjaya Ditambah.', 'success');
          } else if (this.name == 'edit') {
            Swal.fire('Berjaya!', 'Maklumat Rujukan Berjaya Dikemaskini.', 'success');
          }
          this.activeModal.close(true);
        });
    }
  }
}
