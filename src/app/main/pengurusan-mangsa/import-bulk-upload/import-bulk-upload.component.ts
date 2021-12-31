import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import {HttpClient} from "@angular/common/http";
import {FormBuilder, FormGroup} from "@angular/forms";
import { ConfirmationService } from '@app/shared/services/confirmation';

@Component({
  selector: 'app-import-bulk-upload',
  templateUrl: './import-bulk-upload.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig]
})
export class ImportBulkUploadComponent implements OnInit {
  @Input() name;
  @Input() id;

  formGroup: FormGroup;
  files: File;
  saving = false;
  serverUrl = environment.apiUrl + '/api/excel/uploadMangsa';
  response: any = {};
  sizeImage: number;

	modelFooter: NgbDateStruct;
	today = this.calendar.getToday();

	constructor(
    public activeModal: NgbActiveModal,
    private calendar: NgbCalendar,
    private _confirmationService: ConfirmationService,
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
  }

  onSelect(event) {
      this.files = event.target.files[0];
      this.sizeImage = event.target.files[0].size;
      const file = this.files;
      this.formGroup.get('file').setValue(file);
  }

  success() {
    const dialogRef = this._confirmationService.open({
      title: 'Berjaya',
      message: 'Fail excel berjaya dihantar dan sedang diproses. Sila semak emel anda untuk tindakan lanjut',
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

  saveFail(){
    this.saving = true;

    const formData = new FormData();

    formData.append('excel', this.formGroup.get('file').value);

    this.httpClient.post<any>(this.serverUrl, formData).subscribe((res) => {
      this.response = res;
      console.log(this.response);
      this.success();
    });
  }

}
