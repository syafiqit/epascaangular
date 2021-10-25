import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FileUploader, FileUploaderOptions } from "ng2-file-upload";
import { CookieService } from "ngx-cookie-service";
import {base64ToFile, ImageCroppedEvent} from 'ngx-image-cropper';
import { environment } from "src/environments/environment";
import { swalError, swalSuccess } from '@shared/sweet-alert/swal-constant';

@Component({
  selector: 'image-uploader',
  templateUrl: './image-uploader.component.html',
  styles: [
  ]
})
export class ImageUploaderComponent implements OnInit {

  public uploader: FileUploader;
  public _uploaderOptions: FileUploaderOptions = {};

  @Input()
  public imageChangedEvent: any = '';

  @Input()
  public aspectRatio: any = '';

  @Input()
  public maintainAspectRatio: boolean;

  @Input()
  public cropperMinWidth: any = '';

  @Input()
  public cropperMinHeight: any = '';

  @Input()
  public apiEndpoint = '';

  @Output()
  public change = new EventEmitter();

  @Output()
  public success = new EventEmitter<boolean>();

  constructor(private _cookieService: CookieService) {
  }

  ngOnInit(): void {
    if (!this.aspectRatio) {
      this.aspectRatio = 1 / 1;
    }
    if (!this.cropperMinHeight) {
      this.cropperMinHeight = 400;
    }
    if (!this.cropperMinWidth) {
      this.cropperMinWidth = 400;
    }
    if (!this.apiEndpoint) {
      this.apiEndpoint = '/api/file/UploadTempImage';
    }

    this.uploader = new FileUploader({ url: environment.apiUrl + this.apiEndpoint });
    this._uploaderOptions.autoUpload = false;
    this._uploaderOptions.authToken = 'Bearer ' + this._cookieService.get('token');
    this._uploaderOptions.removeAfterUpload = true;
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
      file.alias = 'image';
    };

    this.uploader.onSuccessItem = (item, response, status) => {
      const resp = JSON.parse(response);
      if (status === 200) {
        this.success.emit(true);
        this.change.emit(resp.gambar);
        swalSuccess.fire({
          title: 'Fail telah dimuatnaik!',
          timer: 1500,
          timerProgressBar: true
        });
      } else {
        this.success.emit(false);
        swalError.fire({
          title: 'Internal Error has occured!',
          text: resp.message,
          showCloseButton: true
        })
      }
      this.imageChangedEvent = '';
    };

    this.uploader.setOptions(this._uploaderOptions);
  }

  imageCroppedFile(event: ImageCroppedEvent) {
    this.uploader.clearQueue();
    this.uploader.addToQueue([<File>base64ToFile(event.base64)]);
  }

  upload(): void {
    this.uploader.uploadAll();
  }

}
