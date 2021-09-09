import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { OutputDownloadTempDto } from '../proxy/service-proxies';

@Injectable({
  providedIn: 'root'
})

export class FileDownloadService {

	downloadTempFile(file: OutputDownloadTempDto) {
		const url = environment.apiUrl + '/api/file/downloadTempFile?file_name=' + file.file_name + '&file_token=' + file.file_token + '&file_type=' + file.file_type;
		location.href = url;
  }
}
